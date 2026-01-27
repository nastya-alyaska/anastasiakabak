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

const getDeviceType = (): string => {
  const userAgent = navigator.userAgent;
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
};

export function useVisitorTracking() {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await supabase.from('visitor_analytics').insert({
          page_path: window.location.pathname,
          visitor_id: getVisitorId(),
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          device_type: getDeviceType(),
        });
      } catch (error) {
        // Silent fail - don't interrupt user experience
        console.error('Failed to track visit:', error);
      }
    };

    trackVisit();
  }, []);
}
