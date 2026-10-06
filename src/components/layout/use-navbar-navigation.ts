'use client';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { navigation } from '@/data/site';

type Destination = {
  id: string;
  href: string;
  deferred: boolean;
  updateHistory: boolean;
  focus: boolean;
};
type SectionPosition = { id: string; top: number };

export function useNavbarNavigation(path: string, header: RefObject<HTMLElement | null>) {
  const [activeSection, setActiveSection] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);
  const positions = useRef<SectionPosition[]>([]);
  const measuredHeaderHeight = useRef(77);
  const pending = useRef<Destination | null>(null);
  const scrollingTo = useRef<{ id: string; top: number } | null>(null);
  const unlockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scheduleUpdate = useRef<() => void>(() => {});

  const releaseScroll = useCallback(() => {
    scrollingTo.current = null;
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    unlockTimer.current = null;
    scheduleUpdate.current();
  }, []);

  const finishPendingNavigation = useCallback(() => {
    const destination = pending.current;
    if (!destination || destination.deferred || window.location.pathname !== '/') return;
    const section = document.getElementById(destination.id);
    if (!section || !document.getElementById('inicio')) return;
    pending.current = null;
    const headerHeight = header.current?.getBoundingClientRect().height || 77;
    const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
    const requested =
      destination.id === 'inicio'
        ? 0
        : section.getBoundingClientRect().top + window.scrollY - headerHeight - margin;
    const top = Math.max(
      0,
      Math.min(requested, document.documentElement.scrollHeight - window.innerHeight),
    );
    if (
      destination.updateHistory &&
      location.pathname + location.search + location.hash !== destination.href
    ) {
      window.history.pushState(null, '', destination.href);
    }
    setActiveSection(destination.id);
    if (unlockTimer.current) clearTimeout(unlockTimer.current);
    scrollingTo.current = { id: destination.id, top };
    unlockTimer.current = setTimeout(releaseScroll, 1600);
    window.scrollTo({
      top,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
    if (destination.focus) {
      const heading = section.querySelector<HTMLElement>('h1, h2');
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus({ preventScroll: true });
      }
    }
    scheduleUpdate.current();
  }, [header, releaseScroll]);

  const requestNavigation = useCallback(
    (destination: Destination) => {
      pending.current = destination;
      finishPendingNavigation();
    },
    [finishPendingNavigation],
  );

  const finishMenuNavigation = useCallback(() => {
    if (!pending.current) return false;
    pending.current.deferred = false;
    finishPendingNavigation();
    return true;
  }, [finishPendingNavigation]);

  useEffect(() => {
    let disposed = false;
    let frame = 0;
    let observer: IntersectionObserver | null = null;
    let waitingForSections: MutationObserver | null = null;
    const resize = new ResizeObserver(() => measure());
    let sections: HTMLElement[] = [];
    positions.current = [];
    const update = () => {
      if (disposed) return;
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 20);
      if (path !== '/' || !positions.current.length) return;
      if (scrollingTo.current) {
        setActiveSection(scrollingTo.current.id);
        if (Math.abs(y - scrollingTo.current.top) <= 2) {
          scrollingTo.current = null;
          if (unlockTimer.current) clearTimeout(unlockTimer.current);
          unlockTimer.current = null;
        }
        return;
      }
      const line = y + measuredHeaderHeight.current + 20;
      const atBottom =
        y > 0 && Math.ceil(y + window.innerHeight) >= document.documentElement.scrollHeight - 2;
      const current = atBottom
        ? positions.current.at(-1)
        : positions.current.filter((section) => section.top <= line).at(-1);
      setActiveSection(current?.id || 'inicio');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    scheduleUpdate.current = schedule;
    function measure() {
      if (disposed) return;
      const height = Math.ceil(header.current?.getBoundingClientRect().height || 77);
      measuredHeaderHeight.current = height;
      document.documentElement.style.setProperty('--nova-header-height', `${height}px`);
      positions.current = sections
        .map((section) => ({
          id: section.id,
          top: section.getBoundingClientRect().top + window.scrollY,
        }))
        .sort((a, b) => a.top - b.top);
      schedule();
    }
    const observeSections = () => {
      if (disposed) return;
      const ids = navigation.map((item) => item.href.split('#')[1] || 'inicio');
      const found = ids
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => !!section);
      if (found.length !== ids.length) return;
      waitingForSections?.disconnect();
      sections = found;
      observer?.disconnect();
      observer = new IntersectionObserver(measure, {
        rootMargin: '0px 0px -60% 0px',
        threshold: [0, 0.1],
      });
      for (const section of sections) {
        observer.observe(section);
        resize.observe(section);
      }
      measure();
      finishPendingNavigation();
    };
    if (header.current) resize.observe(header.current);
    if (path === '/') {
      // A client-side return may commit the persistent header before the home sections.
      waitingForSections = new MutationObserver(observeSections);
      waitingForSections.observe(document.getElementById('contenido') || document.body, {
        childList: true,
        subtree: true,
      });
      observeSections();
    } else {
      releaseScroll();
      measure();
    }
    const onKey = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key))
        releaseScroll();
    };
    const onHistory = () => {
      pending.current = null;
      releaseScroll();
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('wheel', releaseScroll, { passive: true });
    window.addEventListener('touchstart', releaseScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onHistory);
    document.fonts.ready.then(measure);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      waitingForSections?.disconnect();
      resize.disconnect();
      scheduleUpdate.current = () => {};
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', releaseScroll);
      window.removeEventListener('touchstart', releaseScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onHistory);
    };
  }, [path, header, finishPendingNavigation, releaseScroll]);

  useEffect(
    () => () => {
      if (unlockTimer.current) clearTimeout(unlockTimer.current);
    },
    [],
  );
  return {
    active: path === '/' ? activeSection : path.split('/')[1],
    scrolled,
    requestNavigation,
    finishMenuNavigation,
  };
}
