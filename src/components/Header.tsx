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
        <nav className="flex items-center justify-between gap-4">
          {/* Logo - Left side */}
          <a 
            href="#" 
            className="font-display text-lg sm:text-xl lg:text-2xl font-medium text-primary hover:text-accent transition-colors shrink-0"
          >
            {language === 'uk' ? 'Психолог Анастасія Кабак' : 'Psychologist Anastasiia Kabak'}
          </a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-6 xl:gap-10">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-body text-sm font-medium text-foreground hover:text-accent transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side - Actions */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
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

            {/* Login Link */}
            <Button 
              variant="ghost" 
              size="sm"
              asChild
            >
              <a href="/auth">{language === 'uk' ? 'Вхід' : 'Login'}</a>
            </Button>
          </div>

          {/* Mobile/Tablet Right Side */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3">
            {/* Language Switcher - Mobile */}
            <div className="flex items-center gap-0.5 border border-border rounded-full p-0.5 sm:p-1">
              <button
                onClick={() => setLanguage('uk')}
                className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                  language === 'uk' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                UA
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full transition-colors ${
                  language === 'en' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
            </div>

            {/* Login Button - Mobile */}
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-xs px-2 sm:px-3"
            >
              <a href="/auth">{language === 'uk' ? 'Вхід' : 'Login'}</a>
            </Button>

            {/* Menu Button */}
            <button
              className="p-1.5 sm:p-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
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
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium mt-2 w-full sm:w-auto"
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
