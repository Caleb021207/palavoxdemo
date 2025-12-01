
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/context/DemoContext';

export const useAuthGuard = (redirectTo: string = '/') => {
  const { isDemoMode } = useDemoMode();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Always authenticated in demo mode
    if (isDemoMode) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }
    
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate(redirectTo);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        navigate(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate(redirectTo);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, isDemoMode]);

  return { isAuthenticated, isLoading };
};
