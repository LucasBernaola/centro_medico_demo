'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Menu, X, Clock3, MapPin } from 'lucide-react';
import { Brand } from './brand';
import { navigation, site } from '@/data/site';
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
  const [activeSection, setActiveSection] = useState('inicio');
  const active = path === '/' ? activeSection : path.split('/')[1];
  useEffect(() => {
    if (path !== '/') return;
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);
          if (visible[0]) setActiveSection(visible[0].target.id);
        },
        { rootMargin: `-118px 0px -${Math.max(0, window.innerHeight - 180)}px 0px`, threshold: 0 },
      );
      for (const item of navigation) {
        const id = item.href.split('#')[1] || 'inicio';
        const section = document.getElementById(id);
        if (section) observer.observe(section);
      }
    };
    observe();
    window.addEventListener('resize', observe);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', observe);
    };
  }, [path]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 20);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [path]);
  return (
    <>
      <div className="utility-bar">
        <div className="container">
          <span>Un mismo lugar. Muchas formas de cuidarte.</span>
          <span>
            <Clock3 size={13} />
            {site.shortHours}
          </span>
          <span className="demo-label">Sitio de demostración</span>
        </div>
      </div>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Brand />
          <nav className="desktop-navigation" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                aria-current={
                  active === (item.href.split('#')[1] || 'inicio') ? 'location' : undefined
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/turnos"
            className="button nav-cta"
            aria-current={path === '/turnos' ? 'page' : undefined}
          >
            Solicitar turno
            <ArrowUpRight size={16} />
          </Link>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger className="menu-button icon-button" aria-label="Abrir menú">
              <Menu size={22} />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="menu-overlay" />
              <Dialog.Content className="menu-panel">
                <div className="menu-top">
                  <Brand />
                  <Dialog.Title className="sr-only">Centro Médico Nova</Dialog.Title>
                  <Dialog.Close className="icon-button" aria-label="Cerrar menú">
                    <X size={22} />
                  </Dialog.Close>
                </div>
                <Dialog.Description>Tu salud, más cerca.</Dialog.Description>
                <nav aria-label="Menú móvil">
                  {navigation.map((item) => (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      key={item.label}
                      aria-current={
                        active === (item.href.split('#')[1] || 'inicio') ? 'location' : undefined
                      }
                    >
                      {item.label}
                      <ArrowUpRight size={17} />
                    </Link>
                  ))}
                </nav>
                <Link className="button" href="/turnos" onClick={() => setOpen(false)}>
                  Solicitar turno
                  <ArrowUpRight size={17} />
                </Link>
                <div className="menu-contact">
                  <MapPin size={16} />
                  <span>
                    {site.address}
                    <small>{site.shortHours}</small>
                  </span>
                </div>
                <p className="menu-demo">{site.demoNotice}</p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
