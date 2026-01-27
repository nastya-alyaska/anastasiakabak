import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Services } from '@/components/Services';
import { Education } from '@/components/Education';
import { Contacts } from '@/components/Contacts';
import { Footer } from '@/components/Footer';
import { useVisitorTracking } from '@/hooks/useVisitorTracking';

const Index = () => {
  // Track visitor analytics
  useVisitorTracking();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Education />
        <Contacts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
