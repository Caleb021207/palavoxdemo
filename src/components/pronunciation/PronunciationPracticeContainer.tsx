import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Trophy, Target, Loader2, RotateCcw, CheckCircle2, XCircle, Play, Square, Sparkles, Star, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PracticeLevel = "Novice" | "Intermediate" | "Advanced" | "Superior";

interface WordFeedback {
  word: string;
  isCorrect: boolean;
  suggestion?: string;
}

interface PronunciationResult {
  accuracyScore: number;
  wordAnalysis: WordFeedback[];
  overallFeedback: string;
}

interface GeneratedPhrase {
  phrase: string;
  translation: string;
  topic: string;
  level: string;
}

const LEVELS: { value: PracticeLevel; label: string; description: string; icon: typeof Star; gradient: string }[] = [
  { value: "Novice", label: "Novice", description: "Simple words and basic phrases", icon: Star, gradient: "from-primary to-palavox-teal" },
  { value: "Intermediate", label: "Intermediate", description: "Everyday sentences", icon: Zap, gradient: "from-palavox-teal to-accent" },
  { value: "Advanced", label: "Advanced", description: "Complex vocabulary", icon: Sparkles, gradient: "from-accent to-primary" },
  { value: "Superior", label: "Superior", description: "Academic/professional content", icon: Trophy, gradient: "from-primary to-accent" },
];

const PronunciationPracticeContainer = () => {
  const { toast } = useToast();
  
  // State
  const [stage, setStage] = useState<"select" | "practice" | "result">("select");
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel | null>(null);
  const [generatedPhrase, setGeneratedPhrase] = useState<GeneratedPhrase | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [playingPhrase, setPlayingPhrase] = useState(false);
  
  // Audio refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Generate phrase based on level
  const generatePhrase = async (level: PracticeLevel) => {
    setIsGenerating(true);
    setSelectedLevel(level);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-pronunciation-phrase", {
        body: {
          targetLanguage: "english",
          level,
          nativeLanguage: "english",
          timestamp: Date.now(),
        },
      });

      if (error) throw error;

      setGeneratedPhrase(data);
      setStage("practice");
    } catch (err) {
      console.error("Error generating phrase:", err);
      toast({
        title: "Error",
        description: "Failed to generate phrase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Play TTS for a word or phrase
  const playTTS = async (text: string, isWord = false) => {
    if (isWord) {
      setPlayingWord(text);
    } else {
      setPlayingPhrase(true);
    }

    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, language: "english" },
      });

      if (error) throw error;

      if (data?.audioContent) {
        const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
        audioRef.current = audio;
        audio.onended = () => {
          setPlayingWord(null);
          setPlayingPhrase(false);
        };
        await audio.play();
      }
    } catch (err) {
      console.error("TTS error:", err);
      setPlayingWord(null);
      setPlayingPhrase(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());
        await gradeRecording();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  // Stop recording and grade
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Grade the recording
  const gradeRecording = async () => {
    if (!generatedPhrase) return;
    
    setIsGrading(true);

    try {
      // Combine audio chunks
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const base64Audio = await blobToBase64(audioBlob);

      // Transcribe with Whisper
      const { data: transcribeData, error: transcribeError } = await supabase.functions.invoke("transcribe-audio", {
        body: { audio: base64Audio, language: "en" },
      });

      if (transcribeError) throw transcribeError;

      const actualPhrase = transcribeData.text;
      console.log("Transcribed:", actualPhrase);

      // Analyze pronunciation
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-pronunciation", {
        body: {
          expectedPhrase: generatedPhrase.phrase,
          actualPhrase,
          language: "en",
          nativeLanguage: "en",
        },
      });

      if (analysisError) throw analysisError;

      setResult(analysisData);
      setStage("result");
    } catch (err) {
      console.error("Grading error:", err);
      toast({
        title: "Error",
        description: "Failed to grade pronunciation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGrading(false);
    }
  };

  // Reset to start
  const resetPractice = () => {
    setStage("select");
    setSelectedLevel(null);
    setGeneratedPhrase(null);
    setResult(null);
    audioChunksRef.current = [];
  };

  // Try same phrase again
  const tryAgain = () => {
    setStage("practice");
    setResult(null);
    audioChunksRef.current = [];
  };

  // Render clickable words
  const renderClickableWords = () => {
    if (!generatedPhrase) return null;
    
    const words = generatedPhrase.phrase.split(/\s+/);
    
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {words.map((word, idx) => (
          <motion.button
            key={idx}
            onClick={() => playTTS(word.replace(/[.,!?;:]/g, ""), true)}
            className={`px-4 py-3 rounded-xl text-lg font-semibold transition-all shadow-lg ${
              playingWord === word.replace(/[.,!?;:]/g, "")
                ? "bg-gradient-to-r from-primary to-accent text-primary-foreground scale-110"
                : "bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl"
            }`}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            disabled={playingWord !== null || playingPhrase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {word}
          </motion.button>
        ))}
      </div>
    );
  };

  // Render word analysis in results
  const renderWordAnalysis = () => {
    if (!result?.wordAnalysis) return null;
    
    return (
      <div className="flex flex-wrap gap-3 justify-center">
        {result.wordAnalysis.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08, type: "spring" }}
            className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg ${
              item.isCorrect
                ? "bg-gradient-to-r from-green-500/20 to-palavox-teal/20 text-green-600 dark:text-green-400 border border-green-500/30"
                : "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400 border border-red-500/30"
            }`}
            title={item.suggestion || "Correct!"}
          >
            {item.isCorrect ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            {item.word}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px, 40px 40px'
        }}
      />

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" as const }}
        className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const, delay: 2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as const, delay: 4 }}
        className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-palavox-teal/15 rounded-full blur-3xl"
      />

      <div className="max-w-5xl mx-auto p-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="mb-10 text-center"
        >
          <motion.div 
            className="inline-flex items-center justify-center gap-3 mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
          >
            <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-3xl shadow-2xl">
              <Volume2 className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-palavox-teal to-accent bg-clip-text text-transparent">
            Pronunciation Practice
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Perfect your English pronunciation with AI-powered feedback
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Stage 1: Level Selection */}
          {stage === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                    <Target className="h-7 w-7 text-primary" />
                    Select Difficulty Level
                  </CardTitle>
                  <p className="text-center text-muted-foreground mt-2">
                    Choose your challenge level to begin practicing
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    {LEVELS.map((level, idx) => {
                      const Icon = level.icon;
                      return (
                        <motion.button
                          key={level.value}
                          onClick={() => generatePhrase(level.value)}
                          disabled={isGenerating}
                          className="group relative p-6 rounded-2xl border-2 border-border/50 bg-card/50 hover:border-primary/50 transition-all text-left overflow-hidden"
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          {/* Gradient overlay on hover */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                          
                          <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-lg`}>
                                <Icon className="w-7 h-7 text-white" />
                              </div>
                              <div>
                                <span className="font-bold text-xl block">{level.label}</span>
                                <Badge variant="secondary" className="mt-1">{level.value}</Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{level.description}</p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {isGenerating && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-center gap-3 mt-8 p-4 rounded-xl bg-primary/10"
                    >
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-lg font-medium text-primary">Generating your phrase...</span>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 2: Practice */}
          {stage === "practice" && generatedPhrase && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-xl">
                        <Volume2 className="h-6 w-6 text-white" />
                      </div>
                      Your Phrase
                    </CardTitle>
                    <Badge variant="outline" className="text-base px-4 py-1">{selectedLevel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Topic */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Badge className="bg-gradient-to-r from-palavox-teal/20 to-accent/20 text-foreground border border-palavox-teal/30 text-base px-4 py-1">
                      {generatedPhrase.topic}
                    </Badge>
                  </motion.div>
                  
                  {/* Clickable words */}
                  <div className="p-8 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl border border-border/30">
                    {renderClickableWords()}
                    <p className="text-sm text-muted-foreground text-center mt-4">
                      Click any word to hear its pronunciation
                    </p>
                  </div>
                  
                  {/* Translation */}
                  <motion.div 
                    className="text-center text-muted-foreground italic text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    "{generatedPhrase.translation}"
                  </motion.div>
                  
                  {/* Play full phrase button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => playTTS(generatedPhrase.phrase)}
                      disabled={playingPhrase || playingWord !== null}
                      className="gap-3 px-8 py-6 text-lg bg-gradient-to-r from-primary to-palavox-teal hover:opacity-90 shadow-xl"
                    >
                      {playingPhrase ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                      Listen to Full Phrase
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recording Card */}
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="pt-8 pb-8">
                  <div className="text-center space-y-6">
                    <motion.p 
                      className="text-xl text-muted-foreground"
                      key={isRecording ? "recording" : isGrading ? "grading" : "ready"}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {isRecording 
                        ? "Recording... Click stop when finished"
                        : isGrading 
                          ? "Analyzing your pronunciation..."
                          : "Click record and read the phrase aloud"}
                    </motion.p>
                    
                    <motion.div className="flex justify-center gap-4">
                      {!isRecording && !isGrading && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Button
                            onClick={startRecording}
                            size="lg"
                            className="gap-3 px-10 py-8 text-xl bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-2xl rounded-2xl"
                          >
                            <Mic className="h-8 w-8" />
                            Start Recording
                          </Button>
                        </motion.div>
                      )}
                      
                      {isRecording && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Button
                            onClick={stopRecording}
                            size="lg"
                            variant="destructive"
                            className="gap-3 px-10 py-8 text-xl shadow-2xl rounded-2xl"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ repeat: Infinity, duration: 0.8 }}
                            >
                              <Square className="h-8 w-8" />
                            </motion.div>
                            Stop Recording
                          </Button>
                        </motion.div>
                      )}
                      
                      {isGrading && (
                        <motion.div 
                          className="flex items-center gap-3 text-primary p-4 rounded-xl bg-primary/10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Loader2 className="h-8 w-8 animate-spin" />
                          <span className="text-xl font-medium">Grading your pronunciation...</span>
                        </motion.div>
                      )}
                    </motion.div>
                    
                    <Button
                      onClick={resetPractice}
                      variant="ghost"
                      className="gap-2 text-muted-foreground hover:text-foreground"
                      disabled={isRecording || isGrading}
                    >
                      <RotateCcw className="h-5 w-5" />
                      Choose Different Level
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 3: Results */}
          {stage === "result" && result && generatedPhrase && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardContent className="pt-8">
                  <div className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 150, delay: 0.2 }}
                    >
                      <div className={`inline-flex items-center justify-center w-36 h-36 rounded-full shadow-2xl ${
                        result.accuracyScore >= 80 
                          ? "bg-gradient-to-br from-green-400 to-palavox-teal" 
                          : result.accuracyScore >= 60 
                            ? "bg-gradient-to-br from-yellow-400 to-orange-400"
                            : "bg-gradient-to-br from-red-400 to-pink-400"
                      }`}>
                        <div className="text-center">
                          <Trophy className="w-10 h-10 text-white mx-auto mb-1" />
                          <span className="text-4xl font-bold text-white">{result.accuracyScore}%</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-2xl font-bold mb-2">
                        {result.accuracyScore >= 80 ? "Excellent! 🎉" : result.accuracyScore >= 60 ? "Good Job! 👍" : "Keep Practicing! 💪"}
                      </h3>
                      <Progress 
                        value={result.accuracyScore} 
                        className="h-4 w-64 mx-auto rounded-full"
                      />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Word Analysis Card */}
              <Card className="bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center gap-2 text-xl">
                    <Target className="h-6 w-6 text-primary" />
                    Word-by-Word Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Original phrase */}
                  <div className="p-4 bg-muted/30 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-2">Target Phrase</p>
                    <p className="text-xl font-medium">{generatedPhrase.phrase}</p>
                  </div>
                  
                  {/* Word analysis */}
                  <div className="p-6 bg-gradient-to-br from-muted/20 to-transparent rounded-xl">
                    {renderWordAnalysis()}
                  </div>
                  
                  {/* Feedback */}
                  <motion.div 
                    className="p-5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <p className="text-center text-lg">{result.overallFeedback}</p>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  onClick={tryAgain}
                  size="lg"
                  className="gap-3 px-8 py-6 text-lg bg-gradient-to-r from-palavox-teal to-accent hover:opacity-90 shadow-xl rounded-xl"
                >
                  <RotateCcw className="h-5 w-5" />
                  Try Same Phrase
                </Button>
                <Button
                  onClick={resetPractice}
                  variant="outline"
                  size="lg"
                  className="gap-3 px-8 py-6 text-lg border-2 rounded-xl"
                >
                  <Sparkles className="h-5 w-5" />
                  New Challenge
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PronunciationPracticeContainer;
