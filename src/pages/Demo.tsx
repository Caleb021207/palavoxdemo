import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoMode } from '@/context/DemoContext';

const Demo = () => {
  const navigate = useNavigate();
  const { setDemoMode } = useDemoMode();

  useEffect(() => {
    // Enable demo mode
    setDemoMode(true);
    
    // Redirect to profile page
    navigate('/profile');
  }, [setDemoMode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading demo...</p>
      </div>
    </div>
  );
};

export default Demo;
