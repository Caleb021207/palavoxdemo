import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Volume2, Trophy, Target, Headphones, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GradientBlob } from "@/components/ui/decorative-elements";

const PronunciationPracticeContainer = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);

  const handleStartPractice = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording 
        ? "Practice session ended" 
        : "Speak clearly into your microphone",
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
      <GradientBlob className="top-20 left-10" />
      <GradientBlob className="bottom-20 right-10" colors="from-palavox-teal to-palavox-accent" />
      
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "backOut" }}
            className="inline-flex items-center justify-center gap-3 mb-4"
          >
            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-sm border border-primary/20">
              <Volume2 className="w-10 h-10 md:w-12 md:h-12 text-primary" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Pronunciation Practice
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground"
          >
            Students perfect their English pronunciation with AI-powered speech analysis
          </motion.p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Practice Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="glass border-primary/20 h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5 hover:border-primary/40 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-4">
                    Students speak English words, phrases, or sentences into their microphone. Our AI analyzes their pronunciation and provides instant feedback on:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Accurate pronunciation of individual sounds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Stress patterns and intonation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Comparison with native speaker models</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>Specific areas for improvement</span>
                    </li>
                  </ul>
                </div>

                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="relative"
                >
                  <Button 
                    onClick={handleStartPractice}
                    className="w-full py-8 text-lg font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                    variant={isRecording ? "destructive" : "default"}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="flex items-center gap-3 relative z-10">
                      <motion.div
                        animate={{
                          scale: isRecording ? [1, 1.2, 1] : 1,
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isRecording ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                        className="relative"
                      >
                        <div className={`absolute inset-0 ${isRecording ? 'bg-red-500' : 'bg-primary'}/30 rounded-full blur-md animate-pulse`} />
                        <Mic className="h-6 w-6 relative z-10" />
                      </motion.div>
                      <span>{isRecording ? "Stop Recording" : "Start Practicing"}</span>
                    </span>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="h-full"
          >
            <Card className="glass border-primary/20 h-full bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 hover:border-green-500/40 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="h-5 w-5 text-green-600" />
                  Practice Tips for Students
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <ul className="space-y-4">
                  {[
                    { icon: Volume2, text: "Listen carefully to the model pronunciation before attempting to speak" },
                    { icon: Target, text: "Pay attention to where stress falls in multi-syllable words" },
                    { icon: Mic, text: "Practice difficult sounds multiple times until they feel natural" },
                    { icon: Headphones, text: "Record yourself and compare with native speaker examples" },
                    { icon: Trophy, text: "Be patient - pronunciation improvement takes consistent practice" }
                  ].map((tip, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
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
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="glass border-primary/20 bg-gradient-to-br from-card/50 via-card to-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Learning Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent rounded-xl border border-primary/20">
                  <h3 className="font-semibold mb-2">Build Confidence</h3>
                  <p className="text-sm text-muted-foreground">
                    Students gain confidence speaking English through safe, judgment-free practice
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-accent/10 to-transparent rounded-xl border border-accent/20">
                  <h3 className="font-semibold mb-2">Instant Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time AI analysis helps students correct mistakes immediately
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-palavox-teal/10 to-transparent rounded-xl border border-palavox-teal/20">
                  <h3 className="font-semibold mb-2">Track Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    Students can see their pronunciation improvement over time with detailed metrics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PronunciationPracticeContainer;
