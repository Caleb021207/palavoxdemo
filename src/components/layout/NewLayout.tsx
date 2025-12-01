
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TopNavigationDropdown } from "@/components/ui/top-navigation-dropdown";
import { useLocalization } from "@/context/LocalizationContext";
import { MessageSquare, Mic, Home, Volume2, User as UserIcon, Settings, Brain, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface NewLayoutProps {
  children: React.ReactNode;
}

const NewLayout = ({ children }: NewLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocalization();

  const navigationItems = [
    { label: t("home") || "Home", path: "/", icon: <Home className="w-4 h-4" /> },
    { label: t("practice") || "Practice", path: "/practice", icon: <MessageSquare className="w-4 h-4" /> },
    { label: t("unlimitedVoicePractice") || "Voice Chat", path: "/voice-chat", icon: <Mic className="w-4 h-4" /> },
    { label: t("pronunciationPractice") || "Pronunciation", path: "/pronunciation-practice", icon: <Volume2 className="w-4 h-4" /> },
    { label: t("premiumVoicePractice") || "Premium Voice", path: "/premium-voice-practice", icon: <Sparkles className="w-4 h-4" /> },
    { label: t("aiAnalysis") || "AI Analysis", path: "/analysis", icon: <Brain className="w-4 h-4" /> },
    { label: t("profile") || "Profile", path: "/profile", icon: <UserIcon className="w-4 h-4" /> },
    { label: t("settings") || "Settings", path: "/settings", icon: <Settings className="w-4 h-4" /> },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background text-foreground">
      {/* Top Bar */}
      <div className="bg-card/80 backdrop-blur-lg border-b sticky top-0 z-30 shadow-sm">
        {/* Navigation Bar */}
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/")}
              className="text-[120px] md:text-[180px] font-bold gradient-text cursor-pointer hover:opacity-80 transition-opacity leading-none"
            >
              Palavox
            </motion.button>
            <TopNavigationDropdown
              items={navigationItems}
              currentPath={location.pathname}
              onNavigate={handleNavigate}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
};

export default NewLayout;
