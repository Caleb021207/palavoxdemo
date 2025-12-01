import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Sparkles, Headphones, Trophy, RefreshCw, Target, Clock, Zap, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudioManager";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { useLocalization } from "@/context/LocalizationContext";
import { supabase } from "@/integrations/supabase/client";
import { getLanguagePair } from "@/utils/languageUtils";
import { useGamification } from "@/hooks/useGamification";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PremiumVoicePractice = () => {
  const { t, currentLanguage } = useLocalization();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'gpt' | 'custom'>('gpt');
  const chatRef = useRef<RealtimeChat | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Custom realtime state
  const [customSessionId, setCustomSessionId] = useState<string | null>(null);
  const [customElapsedSeconds, setCustomElapsedSeconds] = useState(0);
  const [customState, setCustomState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [customMessages, setCustomMessages] = useState<Array<{ role: string; content: string }>>([]);
  const customChatRef = useRef<any | null>(null);
  const customTimerRef = useRef<number | null>(null);
  
  const { premiumVoiceMinutesRemaining, checkCanStartPremiumVoiceSession, trackPremiumVoiceSession } = useUsageLimits();
  const { awardXP, showLevelUpModal, setShowLevelUpModal, levelUpData, progression } = useGamification();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (customTimerRef.current) clearInterval(customTimerRef.current);
      chatRef.current?.disconnect();
      customChatRef.current?.disconnect();
    };
  }, []);

  const handleMessage = (event: any) => {
    if (event.type === 'time_warning') {
      toast({
        title: t('timeWarning'),
        description: t('minutesRemainingWarning', { 
          minutes: String(event.minutes_remaining),
          plural: event.minutes_remaining > 1 ? 's' : ''
        }),
        variant: "default",
      });
    } else if (event.type === 'time_limit_reached') {
      toast({
        title: t('sessionEnded'),
        description: t('premiumSessionEndedMessage'),
        variant: "default",
      });
      endConversation();
    }
  };

  const startConversation = async (selectedProvider: 'gpt' | 'gemini') => {
    if (isStarting || isConnected || customSessionId) return;

    setIsStarting(true);
    try {
      const canStart = await checkCanStartPremiumVoiceSession() as any;
      if (!canStart?.allowed) {
        toast({
          title: t('limitReached'),
          description: t('monthlyLimitMessage', { minutes: String(canStart?.minutes_limit || 15) }),
          variant: "destructive",
        });
        setIsStarting(false);
        return;
      }

      chatRef.current = new RealtimeChat(handleMessage, setIsSpeaking, selectedProvider);
      await chatRef.current.init();
      
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);
      
      setIsConnected(true);
      setElapsedSeconds(0);
      
      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
      
      toast({
        title: t('connected'),
        description: t('premiumVoiceReady'),
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
      setIsConnected(false);
    } finally {
      setIsStarting(false);
    }
  };

  const startCustomSession = async () => {
    if (isStarting || customSessionId || isConnected) return;

    setIsStarting(true);
    try {
      const { CustomRealtimeManager } = await import("@/utils/CustomRealtimeManager");
      const { native } = getLanguagePair(currentLanguage);
      
      const manager = new CustomRealtimeManager(
        'english',
        native.toLowerCase(),
        currentLanguage,
        'intermediate',
        (state) => setCustomState(state),
        (message) => {
          setCustomMessages(prev => [...prev, message]);
        },
        (error) => {
          toast({
            title: t("error"),
            description: error,
            variant: "destructive",
          });
        }
      );

      await manager.initialize();
      customChatRef.current = manager;
      manager.clearHistory();

      const newSessionId = crypto.randomUUID();
      setCustomSessionId(newSessionId);
      setCustomElapsedSeconds(0);

      customTimerRef.current = window.setInterval(() => {
        setCustomElapsedSeconds(prev => prev + 1);
      }, 1000);

      await manager.startListening();

      toast({
        title: "Connected",
        description: "Custom realtime session started",
      });
    } catch (error) {
      console.error('Error starting custom session:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start custom session",
        variant: "destructive",
      });
      setCustomSessionId(null);
    } finally {
      setIsStarting(false);
    }
  };

  const endCustomSession = async () => {
    if (customTimerRef.current) {
      clearInterval(customTimerRef.current);
      customTimerRef.current = null;
    }

    const minutesUsed = Math.ceil(customElapsedSeconds / 60);

    if (minutesUsed > 0 && customMessages.length > 0) {
      await awardXP('realtime_ai');
    }

    if (customChatRef.current && minutesUsed > 0 && customSessionId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.id) {
          await supabase.from('usage_tracking').insert({
            student_id: user.id,
            session_type: 'custom_realtime_practice',
            session_id: customSessionId,
            started_at: new Date(Date.now() - customElapsedSeconds * 1000).toISOString(),
            ended_at: new Date().toISOString(),
            minutes_used: minutesUsed,
            messages_count: customMessages.length,
          });
        }
      } catch (error) {
        console.error('Error tracking custom usage:', error);
      }
    }

    customChatRef.current?.disconnect();
    setCustomSessionId(null);
    setCustomElapsedSeconds(0);
    setCustomState('idle');
    setCustomMessages([]);

    toast({
      title: "Session Saved",
      description: `Used ${minutesUsed} minute${minutesUsed !== 1 ? 's' : ''} of custom realtime`,
    });
  };

  const endConversation = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const minutesUsed = Math.ceil(elapsedSeconds / 60);
    
    if (minutesUsed > 0) {
      await awardXP('premium_voice');
    }
    
    if (chatRef.current && minutesUsed > 0 && sessionId) {
      trackPremiumVoiceSession(sessionId, minutesUsed).catch(async (error) => {
        console.error('❌ Client-side tracking failed:', error);
        
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error('No session');
          
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-premium-voice-session`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${session.access_token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ session_id: sessionId, minutes_used: minutesUsed })
            }
          );
          
          if (!response.ok) throw new Error('Server tracking failed');
        } catch (serverError) {
          console.error('❌ Server fallback failed:', serverError);
          
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              const beaconData = new Blob(
                [JSON.stringify({ session_id: sessionId, minutes_used: minutesUsed })],
                { type: 'application/json' }
              );
              
              navigator.sendBeacon(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-premium-voice-session`,
                beaconData
              );
            }
          } catch (beaconError) {
            console.error('❌ Beacon also failed:', beaconError);
          }
          
          toast({
            title: t('error'),
            description: 'Failed to save session. Will retry automatically.',
            variant: "destructive",
          });
        }
      });
    }
    
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setSessionId(null);
    
    toast({
      title: t('sessionSaved'),
      description: t('usedMinutesMessage', { 
        minutes: String(minutesUsed),
        plural: minutesUsed !== 1 ? 's' : ''
      }),
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const minutesRemaining = premiumVoiceMinutesRemaining - Math.ceil(elapsedSeconds / 60);

  useEffect(() => {
    if (isConnected && minutesRemaining <= 0) {
      endConversation();
    }
  }, [minutesRemaining, isConnected]);

  const isSessionActive = isConnected || customSessionId !== null;

  return (
    <>
      {levelUpData && (
        <LevelUpModal
          open={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          oldLevel={levelUpData.oldLevel}
          newLevel={levelUpData.newLevel}
          totalXP={progression?.total_xp || 0}
        />
      )}
      
      <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-palavox-teal/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto p-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-8 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="inline-flex items-center justify-center gap-3 mb-4"
              >
                <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-sm border border-primary/20">
                  <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                {t('premiumVoicePractice')}
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground"
              >
                {t('practiceConversationalEnglish')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20"
              >
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {t('minutesRemainingThisMonth', { minutes: String(premiumVoiceMinutesRemaining) })}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {!isSessionActive ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Mode Selector Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="glass border-primary/20 h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 hover:border-primary/40 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {t("selectComplexityLevel")}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Choose your practice mode
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <RadioGroup value={selectedMode} onValueChange={(value: 'gpt' | 'custom') => setSelectedMode(value)}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-3 p-4 rounded-lg border-2 border-primary/20 hover:border-primary/40 transition-all cursor-pointer bg-gradient-to-r from-primary/5 to-transparent"
                        onClick={() => setSelectedMode('gpt')}
                      >
                        <RadioGroupItem value="gpt" id="gpt" />
                        <Label htmlFor="gpt" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="font-semibold">Palavox Advanced Voice</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('openaiLatestVoiceModel')}
                          </p>
                        </Label>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center space-x-3 p-4 rounded-lg border-2 border-accent/20 hover:border-accent/40 transition-all cursor-pointer bg-gradient-to-r from-accent/5 to-transparent"
                        onClick={() => setSelectedMode('custom')}
                      >
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent" />
                            <span className="font-semibold">Palavox Custom AI</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Multilingual support
                          </p>
                        </Label>
                      </motion.div>
                    </RadioGroup>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        onClick={() => selectedMode === 'gpt' ? startConversation('gpt') : startCustomSession()}
                        disabled={isStarting}
                        className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                      >
                        {isStarting ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            {t("connecting")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {selectedMode === 'gpt' ? t('startGptSession') : t('startCustomSession')}
                            <ChevronRight className="h-5 w-5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>

                    {/* Language Support Info */}
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-sm text-muted-foreground">
                        {selectedMode === 'gpt' ? t('gptLanguageSupport') : t('customLanguageSupport')}
                      </p>
                      {selectedMode === 'custom' && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('customRealtimeDisclaimer')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tips Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card className="glass border-primary/20 h-full bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 hover:border-green-500/40 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
                  <CardHeader className="relative z-10">
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="h-5 w-5 text-green-600" />
                      Practice Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-4">
                      {[
                        { icon: Mic, text: "Speak clearly and naturally" },
                        { icon: Volume2, text: "Practice in a quiet environment" },
                        { icon: RefreshCw, text: "Don't be afraid to make mistakes" },
                        { icon: Trophy, text: "Consistent practice improves fluency" },
                        { icon: Sparkles, text: "The AI adapts to your level" }
                      ].map((tip, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-transparent hover:from-green-500/20 transition-all group"
                        >
                          <tip.icon className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform flex-shrink-0 mt-0.5" />
                          <span className="text-sm flex-1">{tip.text}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50 pointer-events-none" />
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="text-lg">
                        {isConnected ? 'Palavox Advanced Voice' : 'Palavox Custom AI'}
                      </span>
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      {formatTime(isConnected ? elapsedSeconds : customElapsedSeconds)}
                    </motion.span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  {/* Status Indicator */}
                  <div className="flex items-center justify-center gap-3 p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                    <motion.div
                      animate={{
                        scale: (isConnected && isSpeaking) || (customSessionId && customState === 'speaking') ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ repeat: (isConnected && isSpeaking) || (customSessionId && customState === 'speaking') ? Infinity : 0, duration: 1 }}
                      className={`w-3 h-3 rounded-full ${
                        (isConnected && isSpeaking) || (customSessionId && customState === 'speaking')
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-lg font-medium">
                      {isConnected && (isSpeaking ? t('stateSpeaking') : t('stateListening'))}
                      {customSessionId && (
                        customState === 'listening' ? t('stateListening') :
                        customState === 'processing' ? t('stateProcessing') :
                        customState === 'speaking' ? t('stateSpeaking') :
                        t('stateIdle')
                      )}
                    </span>
                  </div>

                  {/* Conversation Display */}
                  {customMessages.length > 0 && (
                    <div className="max-h-60 overflow-y-auto space-y-3 p-4 bg-gradient-to-br from-card/50 to-transparent rounded-xl border border-primary/10">
                      {customMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary/10 ml-8'
                              : 'bg-accent/10 mr-8'
                          }`}
                        >
                          <p className="text-sm font-medium mb-1">
                            {msg.role === 'user' ? t('you') : t('aiTutor')}
                          </p>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* End Session Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={isConnected ? endConversation : endCustomSession}
                      variant="destructive"
                      className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {t('endSession')}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default PremiumVoicePractice;