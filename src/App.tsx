import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { useAuthQuickFix } from './hooks/useAuthQuickFix';
import { setCurrentUser, logout as logoutFromStore } from './store/userSlice';
import { queryClient } from './lib/react-query';
import { registerSW } from './lib/serviceWorker';
import { ThemeProvider } from './components/UI/Theme/ThemeProvider';
import { useRealtimeUpdates } from './hooks/realtime/useRealtime';
import { ModernBackground } from './components/UI/Background/ModernBackground';
import { AuthDebug } from './components/Auth/AuthDebug';
import LoginScreen from './components/Auth/LoginScreen';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import FilterPanel from './components/Layout/FilterPanel';
import Dashboard from './pages/Dashboard';
import Candidates from './pages/Candidates';
import Pipeline from './pages/Pipeline';
import Interviews from './pages/Interviews';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import PredictiveAnalyticsDashboard from './components/Analytics/PredictiveAnalyticsDashboard';
import toast from 'react-hot-toast';

function AppContent() {
  const { user, loading } = useAuthQuickFix();
  const profile = null; // Temporary bypass
  const dispatch = useDispatch();
  
  // Check if debug mode is enabled via URL
  const urlParams = new URLSearchParams(window.location.search);
  const showAuthDebug = urlParams.get('debug') === 'auth';
  
  // Initialize real-time updates
  useRealtimeUpdates();

  // Register Service Worker for PWA functionality
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      registerSW({
        onSuccess: () => {
          console.log('App is ready for offline use');
        },
        onUpdate: () => {
          toast.success('New version available! Please refresh to update.', {
            duration: 8000,
          });
        },
        onError: (error) => {
          console.error('Service Worker registration failed:', error);
        },
      });
    }
  }, []);

  // Sync auth user with Redux
  useEffect(() => {
    if (user) {
      // Set the current user in Redux store with default values
      dispatch(setCurrentUser({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || 'User',
        role: 'senior_hr_manager', // Default role
        avatar: user.user_metadata?.avatar_url || '',
        department: user.user_metadata?.department || 'HR',
        permissions: [],
        preferences: {
          theme: 'light',
          notifications: { email: true, sms: false, push: true },
          dashboard: { defaultView: 'overview', widgets: [] }
        }
      }));
    } else if (!user) {
      // Clear user from Redux when logged out
      dispatch(logoutFromStore());
    }
  }, [user, dispatch]);

  const handleLogin = () => {
    // Login is handled by the LoginScreen component with Supabase
    // The useAuth hook will automatically update when user logs in
  };

  // Remove profile dependency and fix loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-indigo-400 animate-pulse mx-auto"></div>
          </div>
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">TalentTrack</h2>
            <p className="text-gray-600">Initializing your workspace...</p>
            <div className="mt-3 text-sm text-gray-500">
              Restoring your session and loading preferences
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <ModernBackground>
        <LoginScreen onLogin={handleLogin} />
      </ModernBackground>
    );
  }

  return (
    <ModernBackground>
      <div className="h-screen flex">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex-1 flex overflow-hidden">
            <FilterPanel />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route path="/pipeline" element={<Pipeline />} />
                <Route path="/interviews" element={<Interviews />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/analytics/predictive" element={<PredictiveAnalyticsDashboard />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
      
      {/* Auth Debug Panel - Enable with ?debug=auth */}
      <AuthDebug show={showAuthDebug} />
    </ModernBackground>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Provider store={store}>
          <Router>
            <AppContent />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'backdrop-blur-sm',
                style: {
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: 'inherit',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                },
                success: {
                  style: {
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderColor: 'rgba(34, 197, 94, 0.3)',
                    color: '#059669',
                  },
                },
                error: {
                  style: {
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: '#dc2626',
                  },
                },
              }}
            />
          </Router>
        </Provider>
      </ThemeProvider>
      {/* React Query DevTools - only in development */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export default App;