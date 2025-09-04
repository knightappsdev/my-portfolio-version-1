import React, { useEffect } from 'react';

const VisitorTracking: React.FC = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      // Only track with user consent
      const hasConsent = localStorage.getItem('analyticsConsent') === 'true';
      if (!hasConsent) return;

      const visitorData = {
        timestamp: new Date().toISOString(),
        page: window.location.pathname + window.location.search,
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };

      try {
        await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: 'connect@ofemo.uk',
            subject: 'New Visitor on Portfolio',
            html: `
              <h2>New Visitor Tracked</h2>
              <p><strong>Timestamp:</strong> ${visitorData.timestamp}</p>
              <p><strong>Page:</strong> ${visitorData.page}</p>
              <p><strong>Referrer:</strong> ${visitorData.referrer}</p>
              <p><strong>User Agent:</strong> ${visitorData.userAgent}</p>
              <p><strong>Screen Resolution:</strong> ${visitorData.screenResolution}</p>
              <p><strong>Time Zone:</strong> ${visitorData.timeZone}</p>
              <p><strong>Language:</strong> ${visitorData.language}</p>
            `
          })
        });
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    // Track page view
    trackVisitor();

    // Track session duration
    const startTime = Date.now();
    const trackSessionEnd = () => {
      const sessionDuration = Math.round((Date.now() - startTime) / 1000);
      if (sessionDuration > 10) { // Only track if user stayed more than 10 seconds
        console.log('Session duration:', sessionDuration, 'seconds');
      }
    };

    window.addEventListener('beforeunload', trackSessionEnd);
    return () => window.removeEventListener('beforeunload', trackSessionEnd);
  }, []);

  return null; // This component doesn't render anything
};

export default VisitorTracking;
