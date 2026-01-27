import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

// Import certificate images
import mastersDiploma from '@/assets/certificates/masters-diploma.jpg';
import clinicalPsychology from '@/assets/certificates/clinical-psychology.jpg';
import gestaltFirstStep from '@/assets/certificates/gestalt-first-step.jpg';
import militaryTrauma from '@/assets/certificates/military-trauma.jpg';
import stressManagement from '@/assets/certificates/stress-management.jpg';
import firstAid from '@/assets/certificates/first-aid.jpg';

interface Certificate {
  id: string;
  src: string;
  title: string;
}

export function Education() {
  const { t } = useLanguage();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const certificates: Certificate[] = [
    {
      id: '1',
      src: mastersDiploma,
      title: 'Диплом магістра - Психологія',
    },
    {
      id: '2',
      src: clinicalPsychology,
      title: 'Клінічна психологія',
    },
    {
      id: '3',
      src: gestaltFirstStep,
      title: 'Гештальт-терапія (I ступінь)',
    },
    {
      id: '4',
      src: militaryTrauma,
      title: 'Робота з учасниками бойових дій',
    },
    {
      id: '5',
      src: stressManagement,
      title: 'Управління стресом',
    },
    {
      id: '6',
      src: firstAid,
      title: 'Перша психологічна допомога',
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
              <img
                src={cert.src}
                alt={cert.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-primary/80 px-3 py-1 rounded">
                  {t.education.clickToEnlarge}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal - Full screen */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-background border-none">
          <DialogTitle className="sr-only">
            {selectedCert?.title || 'Certificate'}
          </DialogTitle>
          <button
            onClick={() => setSelectedCert(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-background/90 rounded-full hover:bg-background transition-colors shadow-lg"
          >
            <X className="w-6 h-6" />
          </button>
          
          {selectedCert && (
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={selectedCert.src}
                alt={selectedCert.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
