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
      <div className="container-narrow section-padding py-3 lg:py-4">
        <nav className="flex items-center justify-between">
          {/* Logo - Far Left */}
          <a 
            href="#" 
            className="font-display text-base sm:text-lg lg:text-xl font-medium text-primary hover:text-accent transition-colors shrink-0 leading-tight"
          >
            <span className="hidden sm:inline">{language === 'uk' ? 'Психолог Анастасія Кабак' : 'Psychologist Anastasiia Kabak'}</span>
            <span className="sm:hidden flex flex-col">
              <span>{language === 'uk' ? 'Психолог' : 'Psychologist'}</span>
              <span>{language === 'uk' ? 'Анастасія Кабак' : 'Anastasiia Kabak'}</span>
            </span>
          </a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center gap-8 xl:gap-12">
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
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
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
            <div className="flex items-center border border-border rounded-full p-0.5">
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

            {/* Login Button - Mobile */}
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-xs px-2"
            >
              <a href="/auth">{language === 'uk' ? 'Вхід' : 'Login'}</a>
            </Button>

            {/* Menu Button */}
            <button
              className="p-2 hover:bg-muted rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium mt-2 w-full"
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
