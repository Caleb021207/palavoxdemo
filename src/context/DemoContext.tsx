import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { generateDemoTeacherProfile, generateDemoStudents, generateDemoMetrics } from '@/utils/demoMockData';
import { ExtendedUserProfile } from '@/types/school';

interface DemoContextType {
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  demoTeacherProfile: ExtendedUserProfile | null;
  demoStudents: any[];
  demoMetrics: any;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  // Always enable demo mode by default
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [demoTeacherProfile] = useState(generateDemoTeacherProfile());
  const [demoStudents] = useState(generateDemoStudents());
  const [demoMetrics] = useState(generateDemoMetrics());

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        setDemoMode,
        demoTeacherProfile,
        demoStudents,
        demoMetrics,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
};
