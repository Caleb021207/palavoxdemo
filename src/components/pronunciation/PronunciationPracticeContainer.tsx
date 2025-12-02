import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, Trophy, Target, Loader2, RotateCcw, CheckCircle2, XCircle, Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GradientBlob } from "@/components/ui/decorative-elements";
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

const LEVELS: { value: PracticeLevel; label: string; description: string }[] = [
  { value: "Novice", label: "Novice", description: "Simple words and basic phrases" },
  { value: "Intermediate", label: "Intermediate", description: "Everyday sentences" },
  { value: "Advanced", label: "Advanced", description: "Complex vocabulary" },
  { value: "Superior", label: "Superior", description: "Academic/professional content" },
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
      <div className="flex flex-wrap gap-2 justify-center">
        {words.map((word, idx) => (
          <motion.button
            key={idx}
            onClick={() => playTTS(word.replace(/[.,!?;:]/g, ""), true)}
            className={`px-3 py-2 rounded-lg text-lg font-medium transition-all ${
              playingWord === word.replace(/[.,!?;:]/g, "")
                ? "bg-primary text-primary-foreground scale-105"
                : "bg-muted hover:bg-muted/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={playingWord !== null || playingPhrase}
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
      <div className="flex flex-wrap gap-2 justify-center">
        {result.wordAnalysis.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
              item.isCorrect
                ? "bg-green-500/20 text-green-600 border border-green-500/30"
                : "bg-red-500/20 text-red-600 border border-red-500/30"
            }`}
            title={item.suggestion || "Correct!"}
          >
            {item.isCorrect ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            {item.word}
          </motion.div>
        ))}
      </div>
    );
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
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl backdrop-blur-sm border border-primary/20">
              <Volume2 className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Pronunciation Practice
          </h1>
          <p className="text-xl text-muted-foreground">
            Perfect your English pronunciation with AI-powered feedback
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Stage 1: Level Selection */}
          {stage === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Select Difficulty Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {LEVELS.map((level) => (
                      <motion.button
                        key={level.value}
                        onClick={() => generatePhrase(level.value)}
                        disabled={isGenerating}
                        className="p-4 rounded-xl border border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-lg">{level.label}</span>
                          <Badge variant="secondary">{level.value}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </motion.button>
                    ))}
                  </div>
                  
                  {isGenerating && (
                    <div className="flex items-center justify-center gap-2 mt-6 text-primary">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Generating phrase...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Stage 2: Practice */}
          {stage === "practice" && generatedPhrase && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="glass border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-primary" />
                      Your Phrase
                    </CardTitle>
                    <Badge variant="outline">{selectedLevel}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Topic */}
                  <div className="text-center">
                    <Badge variant="secondary" className="mb-4">{generatedPhrase.topic}</Badge>
                  </div>
                  
                  {/* Clickable words */}
                  <div className="p-6 bg-muted/30 rounded-xl">
                    {renderClickableWords()}
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Click any word to hear its pronunciation
                    </p>
                  </div>
                  
                  {/* Translation */}
                  <div className="text-center text-muted-foreground italic">
                    "{generatedPhrase.translation}"
                  </div>
                  
                  {/* Play full phrase button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={() => playTTS(generatedPhrase.phrase)}
                      disabled={playingPhrase || playingWord !== null}
                      variant="outline"
                      className="gap-2"
                    >
                      {playingPhrase ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Listen to Full Phrase
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recording Card */}
              <Card className="glass border-primary/20">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      {isRecording 
                        ? "Recording... Click stop when finished" 
                        : isGrading 
                          ? "Analyzing your pronunciation..."
                          : "Click record and read the phrase aloud"}
                    </p>
                    
                    <motion.div className="flex justify-center gap-4">
                      {!isRecording && !isGrading && (
                        <Button
                          onClick={startRecording}
                          size="lg"
                          className="gap-2 px-8 py-6 text-lg"
                        >
                          <Mic className="h-6 w-6" />
                          Start Recording
                        </Button>
                      )}
                      
                      {isRecording && (
                        <Button
                          onClick={stopRecording}
                          size="lg"
                          variant="destructive"
                          className="gap-2 px-8 py-6 text-lg"
                        >
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                          >
                            <Square className="h-6 w-6" />
                          </motion.div>
                          Stop Recording
                        </Button>
                      )}
                      
                      {isGrading && (
                        <div className="flex items-center gap-2 text-primary">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="text-lg">Grading...</span>
                        </div>
                      )}
                    </motion.div>
                    
                    <Button
                      onClick={resetPractice}
                      variant="ghost"
                      className="gap-2"
                      disabled={isRecording || isGrading}
                    >
                      <RotateCcw className="h-4 w-4" />
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <Card className="glass border-primary/20 overflow-hidden">
                <div className={`h-2 ${
                  result.accuracyScore >= 80 
                    ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                    : result.accuracyScore >= 60 
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-red-500 to-pink-500"
                }`} />
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      Your Score
                    </span>
                    <Badge variant="outline">{selectedLevel}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score display */}
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className={`text-7xl font-bold ${
                        result.accuracyScore >= 80 
                          ? "text-green-500" 
                          : result.accuracyScore >= 60 
                            ? "text-yellow-500"
                            : "text-red-500"
                      }`}
                    >
                      {result.accuracyScore}%
                    </motion.div>
                    <Progress 
                      value={result.accuracyScore} 
                      className="mt-4 h-3"
                    />
                  </div>
                  
                  {/* Original phrase */}
                  <div className="p-4 bg-muted/30 rounded-xl text-center">
                    <p className="text-sm text-muted-foreground mb-2">Target Phrase</p>
                    <p className="text-lg font-medium">{generatedPhrase.phrase}</p>
                  </div>
                  
                  {/* Word analysis */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-3 text-center">Word Analysis</p>
                    {renderWordAnalysis()}
                  </div>
                  
                  {/* Feedback */}
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm">{result.overallFeedback}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action buttons */}
              <div className="flex justify-center gap-4">
                <Button onClick={tryAgain} variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={resetPractice} className="gap-2">
                  <Target className="h-4 w-4" />
                  New Phrase
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PronunciationPracticeContainer;
