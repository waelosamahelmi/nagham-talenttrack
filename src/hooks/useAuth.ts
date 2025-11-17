import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '../lib/supabase';
import { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users']['Row'];

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Safety timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('⚠️ Auth loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    // Get initial session
    const getInitialSession = async () => {
      try {
        setLoading(true);
        console.log('🔄 Getting initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting initial session:', error);
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setLoading(false);
            setSessionLoaded(true);
            clearTimeout(loadingTimeout);
          }
          return;
        }

        console.log('✅ Initial session loaded:', session ? 'Found' : 'None');

        if (isMounted) {
          setUser(session?.user ?? null);
          setSessionLoaded(true);
          
          if (session?.user) {
            console.log('👤 Loading user profile...');
            try {
              const userProfile = await getCurrentUser();
              if (isMounted) {
                setProfile(userProfile);
                console.log('✅ User profile loaded:', userProfile?.name || 'Unknown');
              }
            } catch (profileError) {
              console.error('❌ Error getting user profile:', profileError);
              if (isMounted) {
                setProfile(null);
              }
            }
          } else {
            console.log('👤 No user found, clearing profile');
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          console.log('✅ Auth initialization complete');
          clearTimeout(loadingTimeout);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!isMounted) return;

        // Handle different auth events
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session.user);
          
          try {
            const userProfile = await getCurrentUser();
            if (isMounted) {
              setProfile(userProfile);
              setLoading(false); // Set loading to false after profile is loaded
              console.log('✅ User profile loaded after auth event:', userProfile?.name);
            }
          } catch (error) {
            console.error('Error getting user profile after auth change:', error);
            if (isMounted) {
              setProfile(null);
              setLoading(false); // Set loading to false even if profile loading fails
            }
          }
        }
        
        // Ensure loading is set to false for all events
        if (isMounted && event !== 'INITIAL_SESSION') {
          setLoading(false);
        }
      }
    );

    // Clean up function
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(loadingTimeout);
    };
  }, []); // Remove user dependency to prevent infinite loops
  
  return {
    user,
    profile,
    loading,
    sessionLoaded,
    isAuthenticated: !!user && sessionLoaded,
    isHRManager: profile?.role === 'senior_hr_manager',
    isRecruiter: profile?.role === 'junior_recruiter',
    isDepartmentHead: profile?.role === 'department_head',
    isAdmin: profile?.role === 'admin',
  };
};