'use client';

import { useEffect } from 'react';

export default function ProfileRedirect() {
  useEffect(() => {
    // Redirect from /profile to /home
    window.location.href = '/home';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Redirecting to home page...
    </div>
  );
}
