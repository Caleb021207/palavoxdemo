import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { UsageLimitAlert } from "@/components/usage/UsageLimitAlert";
import { XPNotificationProvider } from "@/contexts/XPNotificationContext";
import { DemoProvider } from "@/context/DemoContext";
import { AccessCodeDialog } from "@/components/auth/AccessCodeDialog";
import NewLayout from "@/components/layout/NewLayout";
import NewLandingPage from "@/components/layout/NewLandingPage";
import Practice from "@/pages/Practice";
import TranscriptAnalysis from "@/pages/TranscriptAnalysis";
import Profile from "@/pages/Profile";
import PronunciationPracticeContainer from "@/components/pronunciation/PronunciationPracticeContainer";
import VoiceChat from "@/pages/VoiceChat";
import Settings from "@/pages/Settings";
import Legal from "@/pages/Legal";
import PremiumVoicePractice from "@/pages/PremiumVoicePractice";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <DemoProvider>
        <XPNotificationProvider>
          <AccessCodeDialog />
          <UsageLimitAlert />
          <NewLayout>
            <Routes>
              <Route path="/" element={<NewLandingPage />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/voice-chat" element={<VoiceChat />} />
              <Route path="/pronunciation-practice" element={<PronunciationPracticeContainer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/analysis" element={<TranscriptAnalysis />} />
              <Route path="/premium-voice-practice" element={<PremiumVoicePractice />} />
              {/* Retired demo stubs — redirect instead of showing dead ends */}
              <Route path="/certificate" element={<Navigate to="/" replace />} />
              <Route path="/class-metrics" element={<Navigate to="/" replace />} />
              <Route path="/code-tester" element={<Navigate to="/" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </NewLayout>
        </XPNotificationProvider>
      </DemoProvider>
    </Router>
  );
}

export default App;

