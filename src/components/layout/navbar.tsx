'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Menu, X, Clock3 } from 'lucide-react';
import { Brand } from './brand';
import { navigation, site } from '@/data/site';
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();
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
              <Link href={item.href} key={item.label}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/turnos" className="button nav-cta">
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
                  <Dialog.Title>Centro Médico Nova</Dialog.Title>
                  <Dialog.Close className="icon-button" aria-label="Cerrar menú">
                    <X size={22} />
                  </Dialog.Close>
                </div>
                <Dialog.Description>Tu salud, más cerca.</Dialog.Description>
                <nav aria-label="Menú móvil">
                  {navigation.map((item) => (
                    <Link href={item.href} onClick={() => setOpen(false)} key={item.label}>
                      {item.label}
                      <ArrowUpRight size={17} />
                    </Link>
                  ))}
                </nav>
                <Link className="button" href="/turnos" onClick={() => setOpen(false)}>
                  Solicitar turno
                  <ArrowUpRight size={17} />
                </Link>
                <p className="menu-demo">{site.demoNotice}</p>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>
    </>
  );
}
