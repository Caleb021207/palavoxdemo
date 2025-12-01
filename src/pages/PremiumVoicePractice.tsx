import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Sparkles, Headphones, Trophy, RefreshCw, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudioManager";
import { useLocalization } from "@/context/LocalizationContext";
import { supabase } from "@/integrations/supabase/client";
import { useGamification } from "@/hooks/useGamification";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import { motion } from "framer-motion";

const PremiumVoicePractice = () => {
  const { t } = useLocalization();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const chatRef = useRef<RealtimeChat | null>(null);
  const timerRef = useRef<number | null>(null);
  
  const { awardXP, showLevelUpModal, setShowLevelUpModal, levelUpData, progression } = useGamification();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      chatRef.current?.disconnect();
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

  const startConversation = async () => {
    if (isStarting || isConnected) return;

    setIsStarting(true);
    try {
      chatRef.current = new RealtimeChat(handleMessage, setIsSpeaking, 'gpt');
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
      // Demo mode - no usage tracking
      console.log('Demo: would track', minutesUsed, 'minutes');
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
            </div>
          </motion.div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
              className="grid gap-6 md:grid-cols-2"
            >
              {/* Start Practice Card */}
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
                      <Sparkles className="h-5 w-5 text-primary" />
                      Palavox Advanced Voice
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('openaiLatestVoiceModel')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6 relative z-10">
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                      <p className="text-sm text-muted-foreground">
                        {t('gptLanguageSupport')}
                      </p>
                    </div>

                    <motion.div 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      <Button 
                        onClick={startConversation}
                        disabled={isStarting}
                        className="w-full py-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {isStarting ? (
                          <span className="flex items-center gap-3 relative z-10">
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            {t("connecting")}
                          </span>
                        ) : (
                          <span className="flex items-center gap-3 relative z-10">
                            <motion.div
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-primary/30 rounded-full blur-md animate-pulse" />
                              <Mic className="h-6 w-6 relative z-10" />
                            </motion.div>
                            <span>{t('startExercise')}</span>
                          </span>
                        )}
                      </Button>
                    </motion.div>
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
                      {t('pronunciationPracticeTips')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-4">
                      {[
                        { icon: Mic, text: t('listenCarefullyTip') },
                        { icon: Volume2, text: t('payAttentionToStressTip') },
                        { icon: RefreshCw, text: t('practiceDifficultSoundsTip') },
                        { icon: Mic, text: t('recordYourselfTip') },
                        { icon: Trophy, text: t('bePatientTip') }
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
                      <span className="text-lg">Palavox Advanced Voice</span>
                    </div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-sm font-medium px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      {formatTime(elapsedSeconds)}
                    </motion.span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6 relative z-10">
                  {/* Status Indicator with Mic Animation */}
                  <div className="flex flex-col items-center justify-center gap-6 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                    <motion.div
                      animate={{
                        scale: isSpeaking ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1.5 }}
                      className="relative"
                    >
                      <motion.div
                        animate={{
                          scale: isSpeaking ? [1, 1.5, 1] : 1,
                          opacity: isSpeaking ? [0.5, 0, 0.5] : 0.3,
                        }}
                        transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1.5 }}
                        className={`absolute inset-0 rounded-full ${
                          isSpeaking ? 'bg-green-500' : 'bg-blue-500'
                        } blur-xl -z-10`}
                        style={{ transform: 'scale(2)' }}
                      />
                      <div className={`p-6 rounded-full ${
                        isSpeaking ? 'bg-green-500/20 border-green-500/40' : 'bg-blue-500/20 border-blue-500/40'
                      } border-2`}>
                        <Mic className={`h-12 w-12 ${
                          isSpeaking ? 'text-green-500' : 'text-blue-500'
                        }`} />
                      </div>
                    </motion.div>
                    <div className="text-center">
                      <span className="text-xl font-medium block mb-1">
                        {isSpeaking ? t('stateSpeaking') : t('stateListening')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {isSpeaking ? 'AI is responding...' : 'Speak naturally'}
                      </span>
                    </div>
                  </div>

                  {/* End Session Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={endConversation}
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