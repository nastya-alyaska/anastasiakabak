import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function Hero() {
  const { t } = useLanguage();

  return (
    <section className="min-h-screen flex items-center justify-center section-padding pt-32">
      <div className="container-narrow text-center">
        <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
          <p className="text-accent font-medium tracking-widest uppercase text-sm">
            {t.hero.subtitle}
          </p>
          
          <h1 className="text-display text-foreground">
            {t.hero.slogan}
          </h1>

          <div className="w-16 h-px bg-accent mx-auto" />

          <Button 
            size="lg"
            className="bg-muted hover:bg-muted/90 text-secondary-foreground font-medium text-lg px-8 py-6"
            asChild
          >
            <a href="#contacts">{t.nav.book}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
