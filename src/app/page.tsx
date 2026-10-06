import { Hero } from '@/components/home/hero';
import { QuickInfo } from '@/components/home/quick-info';
import { SpecialtiesGrid } from '@/components/specialties/specialties-grid';
import { AboutSection } from '@/components/home/about';
import { ProfessionalsGrid } from '@/components/professionals/professionals-grid';
import { NewsCarousel } from '@/components/news/news-carousel';
import { AppointmentCTA } from '@/components/home/appointment-cta';
import { UsefulInfo } from '@/components/home/useful-info';
import { ContactSection } from '@/components/home/contact';
import { Reveal } from '@/components/ui/reveal';
export default function Page() {
  return (
    <>
      <Hero />
      <QuickInfo />
      <Reveal>
        <SpecialtiesGrid />
      </Reveal>
      <AboutSection />
      <Reveal>
        <ProfessionalsGrid />
      </Reveal>
      <NewsCarousel />
      <AppointmentCTA />
      <UsefulInfo />
      <ContactSection />
    </>
  );
}
