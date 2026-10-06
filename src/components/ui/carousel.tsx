'use client';
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNovaMotion } from './motion-provider';
interface CarouselProps {
  children: ReactNode;
  id: string;
  label: string;
  labels: string[];
  previousLabel: string;
  nextLabel: string;
  trackClassName?: string;
  dots?: boolean;
}
export function EditorialCarousel({
  children,
  id,
  label,
  labels,
  previousLabel,
  nextLabel,
  trackClassName = '',
  dots = false,
}: CarouselProps) {
  const { reduced } = useNovaMotion();
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean; pointerId: number } | null>(null);
  const suppressClick = useRef(false);
  const frame = useRef(0);
  const [position, setPosition] = useState({ index: 0, previous: false, next: labels.length > 1 });
  const refresh = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    if (!slide) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    const next = {
      index: atEnd
        ? labels.length - 1
        : Math.min(labels.length - 1, Math.round(el.scrollLeft / (slide.offsetWidth + gap))),
      previous: el.scrollLeft > 2,
      next: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
    };
    setPosition((prev) =>
      prev.index === next.index && prev.previous === next.previous && prev.next === next.next
        ? prev
        : next,
    );
  }, [labels.length]);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const resize = new ResizeObserver(refresh);
    resize.observe(el);
    refresh();
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [refresh]);
  function scrollTo(index: number) {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollTo({
      left: index * (slide.offsetWidth + gap),
      behavior: reduced ? 'instant' : 'smooth',
    });
  }
  function move(delta: number) {
    const el = track.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({
      left: delta * (slide.offsetWidth + gap),
      behavior: reduced ? 'instant' : 'smooth',
    });
  }
  function finishDrag() {
    const el = track.current;
    const pointer = drag.current;
    if (!el || !pointer) return;
    delete el.dataset.dragging;
    if (el.hasPointerCapture(pointer.pointerId)) el.releasePointerCapture(pointer.pointerId);
    drag.current = null;
    if (pointer.moved) {
      suppressClick.current = true;
      const slide = el.firstElementChild as HTMLElement;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      scrollTo(Math.round(el.scrollLeft / (slide.offsetWidth + gap)));
    }
  }
  return (
    <div className={`editorial-carousel ${id}-carousel`}>
      <div
        id={`${id}-track`}
        ref={track}
        className={`carousel-track ${trackClassName}`}
        role="region"
        aria-roledescription="carrusel"
        aria-label={label}
        tabIndex={0}
        onScroll={() => {
          cancelAnimationFrame(frame.current);
          frame.current = requestAnimationFrame(refresh);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault();
            move(event.key === 'ArrowRight' ? 1 : -1);
          } else if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            scrollTo(event.key === 'Home' ? 0 : labels.length - 1);
          }
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => {
          if (event.pointerType !== 'mouse' || event.button !== 0) return;
          suppressClick.current = false;
          drag.current = {
            x: event.clientX,
            left: event.currentTarget.scrollLeft,
            moved: false,
            pointerId: event.pointerId,
          };
        }}
        onPointerMove={(event) => {
          const pointer = drag.current;
          if (!pointer) return;
          const difference = event.clientX - pointer.x;
          if (Math.abs(difference) > 6) {
            pointer.moved = true;
            event.currentTarget.dataset.dragging = 'true';
            if (!event.currentTarget.hasPointerCapture(event.pointerId))
              event.currentTarget.setPointerCapture(event.pointerId);
            event.preventDefault();
            event.currentTarget.scrollLeft = pointer.left - difference;
          }
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
      >
        {Children.map(children, (child, index) => (
          <div
            className="carousel-slide"
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${index + 1} de ${labels.length}: ${labels[index]}`}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="carousel-footer">
        <div className="carousel-counter" aria-hidden="true">
          <strong>{String(position.index + 1).padStart(2, '0')}</strong>
          <span>/ {String(labels.length).padStart(2, '0')}</span>
        </div>
        {dots && (
          <div className="carousel-dots" aria-label="Posición del carrusel">
            {labels.map((text, index) => (
              <button
                key={text}
                type="button"
                aria-label={`Ver novedad ${index + 1}: ${text}`}
                aria-current={position.index === index ? 'true' : undefined}
                onClick={() => scrollTo(index)}
              >
                <span className={position.index === index ? 'active' : ''} />
              </button>
            ))}
          </div>
        )}
        <div className="carousel-controls">
          <button
            type="button"
            className="icon-button"
            aria-label={previousLabel}
            aria-controls={`${id}-track`}
            disabled={!position.previous}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={19} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label={nextLabel}
            aria-controls={`${id}-track`}
            disabled={!position.next}
            onClick={() => move(1)}
          >
            <ArrowRight size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
