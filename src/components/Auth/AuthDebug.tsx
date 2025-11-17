import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AuthDebugProps {
  show?: boolean;
}

export const AuthDebug: React.FC<AuthDebugProps> = ({ show = false }) => {
  const { user, profile, loading, sessionLoaded, isAuthenticated } = useAuth();

  if (!show) return null;

  const clearAuthData = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('talent-track-auth-token');
      sessionStorage.clear();
      window.location.reload();
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      console.log('Session refreshed:', data);
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const checkLocalStorage = () => {
    const authKey = 'talent-track-auth-token';
    const stored = localStorage.getItem(authKey);
    console.log('LocalStorage auth data:', stored);
    return stored;
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <h3 className="font-bold mb-2">🔧 Auth Debug Panel</h3>
      
      <div className="space-y-1 mb-3">
        <div>Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>{loading.toString()}</span></div>
        <div>Session Loaded: <span className={sessionLoaded ? 'text-green-400' : 'text-red-400'}>{sessionLoaded.toString()}</span></div>
        <div>Is Authenticated: <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{isAuthenticated.toString()}</span></div>
        <div>User ID: <span className="text-blue-400">{user?.id || 'null'}</span></div>
        <div>User Email: <span className="text-blue-400">{user?.email || 'null'}</span></div>
        <div>Profile Name: <span className="text-purple-400">{profile?.name || 'null'}</span></div>
        <div>Profile Role: <span className="text-purple-400">{profile?.role || 'null'}</span></div>
      </div>

      <div className="space-y-2">
        <button
          onClick={refreshAuth}
          className="w-full bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Refresh Session
        </button>
        
        <button
          onClick={checkLocalStorage}
          className="w-full bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs"
        >
          Check LocalStorage
        </button>
        
        <button
          onClick={clearAuthData}
          className="w-full bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
        >
          Clear Auth Data
        </button>
      </div>

      <div className="mt-2 text-xs opacity-75">
        Add <code>?debug=auth</code> to URL to show this panel
      </div>
    </div>
  );
};
