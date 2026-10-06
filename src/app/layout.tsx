import localFont from 'next/font/local';
import './globals.css';
import { BookingProvider } from '@/components/appointments/booking-provider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { siteMetadata } from '@/lib/seo';
import { NovaMotion } from '@/components/ui/motion-provider';
const font = localFont({
  src: [
    { path: './fonts/manrope-regular.ttf', weight: '400' },
    { path: './fonts/manrope-semibold.ttf', weight: '600' },
    { path: './fonts/manrope-bold.ttf', weight: '700' },
    { path: './fonts/manrope-extrabold.ttf', weight: '800' },
  ],
  variable: '--font-manrope',
  display: 'swap',
});
const editorial = localFont({
  src: [
    { path: './fonts/instrument-serif-regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/instrument-serif-italic.ttf', weight: '400', style: 'italic' },
  ],
  variable: '--font-editorial',
  display: 'swap',
  preload: true,
});
export const metadata = siteMetadata;
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className={`${font.variable} ${editorial.variable}`}>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <BookingProvider>
          <NovaMotion>
            <Navbar />
            <main id="contenido">{children}</main>
            <Footer />
          </NovaMotion>
        </BookingProvider>
      </body>
    </html>
  );
}
