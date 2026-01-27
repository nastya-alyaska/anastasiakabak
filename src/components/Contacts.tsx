import { useLanguage } from '@/contexts/LanguageContext';
import { Phone, Mail, Instagram, Send } from 'lucide-react';

export function Contacts() {
  const { t } = useLanguage();

  const contactItems = [
    {
      icon: Phone,
      label: t.contacts.phone,
      value: '+380 50 322 38 08',
      href: 'tel:+380503223808',
    },
    {
      icon: Mail,
      label: t.contacts.email,
      value: 'anastasiia003@gmail.com',
      href: 'mailto:anastasiia003@gmail.com',
    },
    {
      icon: Instagram,
      label: t.contacts.instagram,
      value: '@nastya_alyaska',
      href: 'https://www.instagram.com/nastya_alyaska/',
    },
    {
      icon: Send,
      label: t.contacts.telegram,
      value: '@nastya_alyaska',
      href: 'https://t.me/nastya_alyaska',
    },
  ];

  return (
    <section id="contacts" className="section-padding">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-heading text-foreground mb-4">{t.contacts.title}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            {contactItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 p-6 bg-card border border-border rounded-lg shadow-soft hover-lift"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-medium text-foreground group-hover:text-accent transition-colors">
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
