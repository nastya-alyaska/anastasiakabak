import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { User, Users } from 'lucide-react';

export function Services() {
  const { t } = useLanguage();

  const services = [
    {
      icon: User,
      title: t.services.individual.title,
      description: t.services.individual.description,
      duration: t.services.individual.duration,
    },
    {
      icon: Users,
      title: t.services.couples.title,
      description: t.services.couples.description,
      duration: t.services.couples.duration,
    },
  ];

  return (
    <section id="services" className="section-padding">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-heading text-foreground mb-4">{t.services.title}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-8 shadow-soft hover-lift"
            >
              <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-accent" />
              </div>

              <h3 className="text-subheading text-foreground mb-4">{service.title}</h3>
              
              <p className="text-muted-foreground font-body leading-relaxed mb-4">
                {service.description}
              </p>

              <p className="text-sm text-accent font-medium mb-6">{service.duration}</p>

              <Button 
                variant="outline"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <a href="#contacts">{t.services.book}</a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
