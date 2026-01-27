import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  const navItems = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.education, href: '#education' },
  ];

  return (
    <footer className="bg-primary text-primary-foreground section-padding py-12">
      <div className="container-narrow">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Slogan */}
          <p className="font-display text-xl md:text-2xl italic">
            "{t.footer.slogan}"
          </p>

          {/* Divider */}
          <div className="w-12 h-px bg-primary-foreground/30" />

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-body text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Anastasiia Kabak. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  );
}
