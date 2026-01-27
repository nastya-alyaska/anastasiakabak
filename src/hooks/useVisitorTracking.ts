import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = `v_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('visitor_id', visitorId);
  }
  return visitorId;
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const userAgent = navigator.userAgent;
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
};

export function useVisitorTracking() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Use edge function with rate limiting and validation
        const { error } = await supabase.functions.invoke('track-visitor', {
          body: {
            page_path: window.location.pathname.slice(0, 500),
            visitor_id: getVisitorId().slice(0, 100),
            user_agent: navigator.userAgent.slice(0, 1000),
            referrer: document.referrer ? document.referrer.slice(0, 2000) : null,
            device_type: getDeviceType(),
          },
        });

        if (error) {
          // Silent fail - don't interrupt user experience
          console.error('Failed to track visit:', error);
        }
      } catch (error) {
        // Silent fail - don't interrupt user experience
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);
}
