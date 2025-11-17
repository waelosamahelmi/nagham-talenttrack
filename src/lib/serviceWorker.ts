// Service Worker registration and management
import React from 'react';

interface SwRegistrationOptions {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

// Check if service workers are supported
export const isSwSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Register service worker
export const registerSW = async (options: SwRegistrationOptions = {}): Promise<ServiceWorkerRegistration | null> => {
  if (!isSwSupported()) {
    console.log('Service Workers not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registered successfully:', registration);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available
              console.log('New content available, please refresh');
              options.onUpdate?.(registration);
            } else {
              // Content is cached for offline use
              console.log('Content cached for offline use');
              options.onSuccess?.(registration);
            }
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    options.onError?.(error as Error);
    return null;
  }
};

// Unregister service worker
export const unregisterSW = async (): Promise<boolean> => {
  if (!isSwSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('Service Worker unregistered');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Service Worker unregistration failed:', error);
    return false;
  }
};

// Update service worker
export const updateSW = async (): Promise<void> => {
  if (!isSwSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service Worker update triggered');
    }
  } catch (error) {
    console.error('Service Worker update failed:', error);
  }
};

// Skip waiting and activate new service worker
export const skipWaiting = (): void => {
  if (!isSwSupported()) {
    return;
  }

  navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });
};

// Check for service worker updates
export const checkForUpdates = async (): Promise<boolean> => {
  if (!isSwSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return registration.waiting !== null;
    }
    return false;
  } catch (error) {
    console.error('Failed to check for updates:', error);
    return false;
  }
};

// Get cache usage information
export const getCacheInfo = async (): Promise<{ quota: number; usage: number; available: number } | null> => {
  if (!('storage' in navigator) || !('estimate' in navigator.storage)) {
    return null;
  }

  try {
    const estimate = await navigator.storage.estimate();
    const quota = estimate.quota || 0;
    const usage = estimate.usage || 0;
    const available = quota - usage;

    return {
      quota: Math.round(quota / 1024 / 1024), // MB
      usage: Math.round(usage / 1024 / 1024), // MB
      available: Math.round(available / 1024 / 1024), // MB
    };
  } catch (error) {
    console.error('Failed to get cache info:', error);
    return null;
  }
};

// Clear all caches
export const clearAllCaches = async (): Promise<void> => {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  } catch (error) {
    console.error('Failed to clear caches:', error);
  }
};

// Background sync registration
export const registerBackgroundSync = async (tag: string): Promise<void> => {
  if (!isSwSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    if ('sync' in registration) {
      await (registration as any).sync.register(tag);
      console.log('Background sync registered:', tag);
    } else {
      console.log('Background sync not supported');
    }
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
};

// Push notification setup
export const setupPushNotifications = async (): Promise<string | null> => {
  if (!isSwSupported() || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    
    if (permission !== 'granted') {
      console.log('Push notification permission not granted');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY || ''),
    });

    console.log('Push notification subscription:', subscription);
    return JSON.stringify(subscription);
  } catch (error) {
    console.error('Push notification setup failed:', error);
    return null;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Network status monitoring
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
};

export default {
  registerSW,
  unregisterSW,
  updateSW,
  skipWaiting,
  checkForUpdates,
  getCacheInfo,
  clearAllCaches,
  registerBackgroundSync,
  setupPushNotifications,
  useNetworkStatus,
};
