'use client';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Menu, X, Clock3, MapPin } from 'lucide-react';
import { Brand } from './brand';
import { navigation, site } from '@/data/site';
import { useNavbarNavigation } from './use-navbar-navigation';
export function Navbar() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const path = usePathname();
  const { active, scrolled, requestNavigation, finishMenuNavigation } = useNavbarNavigation(
    path,
    header,
  );
  function navigate(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const id = href.split('#')[1] || 'inicio';
    if (path === '/') event.preventDefault();
    requestNavigation({
      id,
      href,
      deferred: open,
      updateHistory: path === '/',
      focus: open || event.detail === 0,
    });
    setOpen(false);
  }
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
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
      <header ref={header} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <Brand onClick={(event) => navigate(event, '/')} />
          <nav className="desktop-navigation" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link
                href={item.href}
                onClick={(event) => navigate(event, item.href)}
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
              <Dialog.Content
                className="menu-panel"
                onCloseAutoFocus={(event) => {
                  if (finishMenuNavigation()) event.preventDefault();
                  else if (window.matchMedia('(min-width: 1024px)').matches) {
                    event.preventDefault();
                    const destination =
                      header.current?.querySelector<HTMLAnchorElement>(
                        '.desktop-navigation [aria-current]',
                      ) ||
                      header.current?.querySelector<HTMLAnchorElement>('.desktop-navigation a');
                    destination?.focus({ preventScroll: true });
                  }
                }}
              >
                <div className="menu-top">
                  <Brand onClick={(event) => navigate(event, '/')} />
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
                      onClick={(event) => navigate(event, item.href)}
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
