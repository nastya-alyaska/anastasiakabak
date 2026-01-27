import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'uk' | 'en';

interface Translations {
  nav: {
    about: string;
    services: string;
    education: string;
    contacts: string;
    book: string;
  };
  hero: {
    slogan: string;
    subtitle: string;
  };
  about: {
    title: string;
    description: string;
    approach: string;
    workWith: string;
  };
  services: {
    title: string;
    individual: {
      title: string;
      description: string;
      duration: string;
    };
    couples: {
      title: string;
      description: string;
      duration: string;
    };
    book: string;
  };
  education: {
    title: string;
    clickToEnlarge: string;
  };
  contacts: {
    title: string;
    phone: string;
    email: string;
    instagram: string;
    telegram: string;
  };
  footer: {
    slogan: string;
    rights: string;
  };
}

const translations: Record<Language, Translations> = {
  uk: {
    nav: {
      about: 'Про мене',
      services: 'Послуги',
      education: 'Освіта',
      contacts: 'Контакти',
      book: 'Записатися',
    },
    hero: {
      slogan: 'Ваш шлях до гармонії починається тут',
      subtitle: 'Гештальт та когнітивно-процесуальна терапія',
    },
    about: {
      title: 'Про мене',
      description: 'Привіт, я Анастасія — практикуючий психолог, який допомагає людям знайти внутрішню рівновагу та побудувати більш гармонійні стосунки з собою та оточуючими. Я працюю в підходах гештальт-терапії та когнітивно-процесуальної терапії.',
      approach: 'Мій підхід базується на створенні безпечного простору, де ви можете досліджувати свої почуття, думки та поведінкові патерни. Разом ми знайдемо шляхи до змін, які ви бажаєте.',
      workWith: 'Працюю з: тривожністю, депресивними станами, стресом, проблемами у стосунках, самооцінкою, життєвими кризами та особистісним зростанням.',
    },
    services: {
      title: 'Послуги',
      individual: {
        title: 'Індивідуальна консультація',
        description: 'Персональна робота над вашими запитами у безпечному та конфіденційному просторі. Підходить для роботи з тривогою, депресією, стресом та особистісним зростанням.',
        duration: 'Тривалість: 50-60 хвилин',
      },
      couples: {
        title: 'Консультація для пар',
        description: 'Спільна робота над покращенням комунікації, вирішенням конфліктів та відновленням близькості у стосунках.',
        duration: 'Тривалість: 80-90 хвилин',
      },
      book: 'Записатися',
    },
    education: {
      title: 'Освіта та сертифікати',
      clickToEnlarge: 'Натисніть для збільшення',
    },
    contacts: {
      title: 'Контакти',
      phone: 'Телефон',
      email: 'Пошта',
      instagram: 'Instagram',
      telegram: 'Telegram',
    },
    footer: {
      slogan: 'Кожен крок до себе — це вже перемога',
      rights: 'Усі права захищені',
    },
  },
  en: {
    nav: {
      about: 'About',
      services: 'Services',
      education: 'Education',
      contacts: 'Contacts',
      book: 'Book Now',
    },
    hero: {
      slogan: 'Your path to harmony starts here',
      subtitle: 'Gestalt and Cognitive-Procedural Therapy',
    },
    about: {
      title: 'About Me',
      description: 'Hi, I\'m Anastasiia — a practicing psychologist helping people find inner balance and build more harmonious relationships with themselves and others. I work within Gestalt therapy and Cognitive-Procedural therapy approaches.',
      approach: 'My approach is based on creating a safe space where you can explore your feelings, thoughts, and behavioral patterns. Together, we\'ll find paths to the changes you desire.',
      workWith: 'I work with: anxiety, depression, stress, relationship issues, self-esteem, life crises, and personal growth.',
    },
    services: {
      title: 'Services',
      individual: {
        title: 'Individual Consultation',
        description: 'Personal work on your concerns in a safe and confidential space. Suitable for anxiety, depression, stress, and personal growth.',
        duration: 'Duration: 50-60 minutes',
      },
      couples: {
        title: 'Couples Consultation',
        description: 'Joint work on improving communication, resolving conflicts, and restoring intimacy in relationships.',
        duration: 'Duration: 80-90 minutes',
      },
      book: 'Book Now',
    },
    education: {
      title: 'Education & Certificates',
      clickToEnlarge: 'Click to enlarge',
    },
    contacts: {
      title: 'Contacts',
      phone: 'Phone',
      email: 'Email',
      instagram: 'Instagram',
      telegram: 'Telegram',
    },
    footer: {
      slogan: 'Every step towards yourself is already a victory',
      rights: 'All rights reserved',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('uk');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
