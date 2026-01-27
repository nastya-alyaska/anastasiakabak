import { useLanguage } from '@/contexts/LanguageContext';
import profilePhoto from '@/assets/photo.png';

export function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="section-padding bg-secondary/30">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div className="relative order-1 lg:order-1">
            <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-elevated">
              <img
                src={profilePhoto}
                alt="Анастасія Кабак - Психолог"
                className="w-full h-full object-cover object-top"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-accent rounded-lg -z-10" />
          </div>

          {/* Content */}
          <div className="order-2 lg:order-2 space-y-6">
            <h2 className="text-heading text-foreground">{t.about.title}</h2>
            
            <div className="w-12 h-px bg-accent" />

            <div className="space-y-4 text-muted-foreground font-body leading-relaxed">
              <p>{t.about.description}</p>
              <p>{t.about.approach}</p>
              <p className="text-foreground font-medium">{t.about.workWith}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
