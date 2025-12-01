import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Sparkles, RefreshCw, Clock, BookOpen, MessageCircle, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudioManager";
import { useGamification } from "@/hooks/useGamification";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import { motion } from "framer-motion";
import { DecorativeOrbs } from "@/components/ui/decorative-elements";

const PremiumVoicePractice = () => {
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
    console.log("Event received:", event);
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
        title: "Connected",
        description: "Advanced voice practice is ready. Start speaking!",
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
    
    chatRef.current?.disconnect();
    setIsConnected(false);
    setIsSpeaking(false);
    setSessionId(null);
    
    toast({
      title: "Session Saved",
      description: `Used ${minutesUsed} minute${minutesUsed !== 1 ? 's' : ''} in this session`,
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
        <DecorativeOrbs />
        
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-palavox-teal to-accent bg-clip-text text-transparent">
                Advanced English Conversation
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground"
              >
                Have natural voice conversations with AI to improve your fluency
              </motion.p>
            </div>
          </motion.div>

          {!isConnected ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* How It Works Card - AT THE TOP */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass border-primary/20 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 hover:border-blue-500/40 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <BookOpen className="h-6 w-6 text-blue-500" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                          1
                        </div>
                        <span className="flex-1 text-base">Click "Start GPT Session" below to begin your conversation</span>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                          2
                        </div>
                        <span className="flex-1 text-base">Speak naturally - the AI listens and responds in real-time</span>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                          3
                        </div>
                        <span className="flex-1 text-base">Have a real conversation to practice fluency and vocabulary</span>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                          4
                        </div>
                        <span className="flex-1 text-base">AI helps with grammar corrections in real-time</span>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-transparent hover:from-blue-500/20 transition-all"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
                          5
                        </div>
                        <span className="flex-1 text-base">🌍 The AI is multilingual! Ask it to speak in any language you need - Spanish, French, Mandarin, or any other language</span>
                      </motion.li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Start Practice Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 hover:border-primary/40 transition-all">
                  <CardContent className="py-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-1">
                      <h2 className="text-2xl font-bold text-foreground">Palavox Realtime</h2>
                      <p className="text-muted-foreground">Palavox Advanced Conversational AI</p>
                    </div>

                    {/* Circle Mic Icon */}
                    <div className="flex justify-center">
                      <motion.div className="relative">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 bg-primary/30 rounded-full blur-xl"
                        />
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/40 flex items-center justify-center relative">
                          <Mic className="h-10 w-10 text-primary" />
                        </div>
                      </motion.div>
                    </div>

                    {/* Start GPT Session Button */}
                    <Button
                      onClick={startConversation}
                      disabled={isStarting}
                      size="lg"
                      className="w-full py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      {isStarting ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="h-5 w-5 animate-spin" />
                          Connecting...
                        </span>
                      ) : (
                        "Start GPT Session"
                      )}
                    </Button>
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
              <Card className="glass border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
                <CardHeader>
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
                
                <CardContent className="space-y-6">
                  {/* Status Indicator */}
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
                        {isSpeaking ? 'AI is speaking...' : 'Listening...'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {isSpeaking ? 'AI is responding to you' : 'Speak naturally in English'}
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
                      End Conversation
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
