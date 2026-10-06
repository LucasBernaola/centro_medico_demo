import { Hero } from '@/components/home/hero';
import { QuickInfo } from '@/components/home/quick-info';
import { SpecialtiesGrid } from '@/components/specialties/specialties-grid';
import { AboutSection } from '@/components/home/about';
import { ProfessionalsGrid } from '@/components/professionals/professionals-grid';
import { NewsSection } from '@/components/news/news-section';
import { Announcements } from '@/components/home/announcements';
import { AppointmentCTA } from '@/components/home/appointment-cta';
import { UsefulInfo } from '@/components/home/useful-info';
import { ContactSection } from '@/components/home/contact';
export default function Page() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <Announcements />
      <SpecialtiesGrid />
      <AboutSection />
      <ProfessionalsGrid />
      <NewsSection />
      <AppointmentCTA />
      <UsefulInfo />
      <ContactSection />
    </>
  );
}
