import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.education, href: '#education' },
    { label: t.nav.contacts, href: '#contacts' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow section-padding py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-display text-xl md:text-2xl font-medium text-primary hover:text-accent transition-colors">
            {language === 'uk' ? 'Психолог Анастасія Кабак' : 'Psychologist Anastasiia Kabak'}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center gap-1 border border-border rounded-full p-1">
              <button
                onClick={() => setLanguage('uk')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  language === 'uk' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                UA
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                  language === 'en' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
            </div>

            {/* Book Button */}
            <Button 
              variant="default" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
              asChild
            >
              <a href="#contacts">{t.nav.book}</a>
            </Button>

            {/* Login Link - Desktop */}
            <Button 
              variant="ghost" 
              size="sm"
              asChild
            >
              <a href="/auth">{language === 'uk' ? 'Вхід' : 'Login'}</a>
            </Button>
          </div>

          {/* Login Button - Always Visible (Mobile/Tablet) */}
          <div className="lg:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-xs px-2"
            >
              <a href="/auth">{language === 'uk' ? 'Вхід' : 'Login'}</a>
            </Button>
          </div>

          {/* Mobile Language Switcher + Menu Button */}
          <div className="lg:hidden flex items-center gap-1">
            <div className="flex items-center gap-1 border border-border rounded-full p-1">
              <button
                onClick={() => setLanguage('uk')}
                className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                  language === 'uk' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                UA
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                  language === 'en' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
            </div>
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-body text-base font-medium text-foreground hover:text-accent transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}


              <Button 
                variant="default" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium mt-2"
                asChild
              >
                <a href="#contacts" onClick={() => setMobileMenuOpen(false)}>{t.nav.book}</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
