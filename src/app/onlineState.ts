import { useState, useEffect } from 'react';

export const useOnlineState = () => {
  const [status, setStatus] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setStatus(window.navigator.onLine);
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const isOnline = status === true;

  return { isOnline };
};
