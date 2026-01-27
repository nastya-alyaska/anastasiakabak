import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import anxietyDisordersCert from '@/assets/certificates/anxiety-disorders.jpeg';

interface Certificate {
  id: string;
  type: 'image' | 'pdf';
  src: string;
  title: string;
}

export function Education() {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    {
      id: '1',
      type: 'image',
      src: anxietyDisordersCert,
      title: 'Тривожні розлади та панічні атаки',
    },
    {
      id: '2',
      type: 'pdf',
      src: '/certificates/masters-degree.pdf',
      title: 'Диплом магістра - Психологія',
    },
    {
      id: '3',
      type: 'pdf',
      src: '/certificates/clinical-psychology.pdf',
      title: 'Клінічна психологія',
    },
    {
      id: '4',
      type: 'pdf',
      src: '/certificates/first-step.pdf',
      title: '1 сходинка гештальт-терапії',
    },
    {
      id: '5',
      type: 'pdf',
      src: '/certificates/stress-management.pdf',
      title: 'Управління стресом',
    },
    {
      id: '6',
      type: 'pdf',
      src: '/certificates/ubd-certificate.pdf',
      title: 'Сертифікат УБД',
    },
    {
      id: '7',
      type: 'pdf',
      src: '/certificates/ppd.pdf',
      title: 'ППД',
    },
  ];

  return (
    <section id="education" className="section-padding bg-secondary/30">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="text-heading text-foreground mb-4">{t.education.title}</h2>
          <div className="w-12 h-px bg-accent mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">{t.education.clickToEnlarge}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {certificates.map((cert) => (
            <button
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="group relative aspect-[3/4] bg-card border border-border rounded-lg overflow-hidden shadow-soft hover-lift cursor-pointer"
            >
              {cert.type === 'image' ? (
                <img
                  src={cert.src}
                  alt={cert.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
                  <div className="w-16 h-20 bg-primary/10 rounded-sm mb-3 flex items-center justify-center">
                    <span className="text-primary font-medium text-xs">PDF</span>
                  </div>
                  <p className="text-xs text-center text-muted-foreground font-medium leading-tight">
                    {cert.title}
                  </p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-primary/80 px-3 py-1 rounded">
                  {t.education.clickToEnlarge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-background">
          <DialogTitle className="sr-only">
            {selectedCert?.title || 'Certificate'}
          </DialogTitle>
          <button
            onClick={() => setSelectedCert(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {selectedCert && (
            <div className="w-full h-full overflow-auto">
              {selectedCert.type === 'image' ? (
                <img
                  src={selectedCert.src}
                  alt={selectedCert.title}
                  className="w-full h-auto"
                />
              ) : (
                <iframe
                  src={selectedCert.src}
                  className="w-full h-[80vh]"
                  title={selectedCert.title}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
