import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Sparkles, CheckCircle, MessageSquare, Lightbulb } from "lucide-react";
import NewLayout from "@/components/layout/NewLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import VoiceChatContainer from "@/components/voice-chat/VoiceChatContainer";
import VoiceRecognitionControls from "@/components/voice-chat/VoiceRecognitionControls";
import ListeningIndicator from "@/components/voice-chat/ListeningIndicator";
import TranscriptDisplay from "@/components/voice-chat/TranscriptDisplay";
import { useVoiceConversation } from "@/hooks/useVoiceConversation";
import { useVoiceSpeechRecognition } from "@/hooks/useVoiceSpeechRecognition";
import { useVoiceTTS } from "@/hooks/useVoiceTTS";
import { DecorativeOrbs } from "@/components/ui/decorative-elements";

const VoiceChat = () => {
  const [grammarCorrection, setGrammarCorrection] = useState(false);
  const [conversationLevel, setConversationLevel] = useState<string>("intermediate");
  
  // Initialize hooks
  const { conversationHistory, isLoading, sendMessage, clearConversation } = useVoiceConversation(conversationLevel, grammarCorrection);
  
  // Add grammar correction flag to messages
  const messagesWithGrammarFlag = conversationHistory.map(msg => ({
    ...msg,
    grammarCorrectionEnabled: grammarCorrection
  }));
  
  const { speakWithAzureTTS, isSpeaking } = useVoiceTTS({ practiceLanguage: "english" });
  
  const { isListening, isTranscribing, transcript, toggleListening, handleSendTranscript, clearTranscript, updateTranscript } = useVoiceSpeechRecognition({
    targetLanguage: "english",
    onTranscriptChange: (text) => {
      // Just update local state, don't auto-send
    },
    useWhisper: true,
    multilingualMode: true
  });

  const handleManualSend = (text: string) => {
    if (text.trim()) {
      sendMessage(text, speakWithAzureTTS);
      clearTranscript();
    }
  };
  
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DecorativeOrbs />
      
      <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-primary/20 via-palavox-teal/20 to-accent/20 rounded-full mb-6">
                <Mic className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-palavox-teal to-accent bg-clip-text text-transparent">
                Unlimited Voice Practice
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Speak English naturally with AI and improve your fluency through conversation
              </p>
            </motion.div>

            {/* Grammar Correction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">AI Feedback Mode</h3>
                      </div>
                      <p className="text-base text-muted-foreground">
                        {grammarCorrection 
                          ? "The AI will correct your grammar and pronunciation during conversations"
                          : "The AI will focus on natural conversation flow without corrections"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-accent/10 p-4 rounded-lg">
                      <Label htmlFor="grammar-toggle" className="text-base font-medium cursor-pointer">
                        Grammar Correction
                      </Label>
                      <Switch
                        id="grammar-toggle"
                        checked={grammarCorrection}
                        onCheckedChange={setGrammarCorrection}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mic Control Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <VoiceRecognitionControls
                      isListening={isListening}
                      isLoading={isLoading}
                      isSpeaking={isSpeaking}
                      transcript={transcript}
                      toggleListening={toggleListening}
                      handleSendTranscript={handleSendTranscript}
                    />
                  </div>
                  
                  <ListeningIndicator isListening={isListening} />
                  
                  <TranscriptDisplay 
                    transcript={transcript} 
                    isListening={isListening}
                    isTranscribing={isTranscribing}
                    onSend={handleManualSend}
                    onTranscriptChange={updateTranscript}
                  />

                  <div className="mt-6">
                    <VoiceChatContainer 
                      messages={messagesWithGrammarFlag}
                      isLoading={isLoading}
                      targetLanguage="english"
                      onPlayAudio={speakWithAzureTTS}
                    />
                  </div>

                  {conversationHistory.length > 0 && (
                    <div className="mt-4 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={clearConversation}
                        className="text-sm"
                      >
                        Clear Conversation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Cards Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* How Students Use This */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">How to Use This Feature</h3>
                  </div>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Click the microphone and speak naturally in English</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>The AI will respond to you with voice and text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Practice pronunciation and conversational skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Get instant feedback on grammar when enabled</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Conversation Starters */}
              <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-palavox-teal/20 to-accent/20 rounded-lg">
                      <Lightbulb className="h-6 w-6 text-palavox-teal" />
                    </div>
                    <h3 className="text-xl font-semibold">Conversation Starters</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Try starting with:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                      <span>"Hello, how are you today?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                      <span>"What did you do this weekend?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                      <span>"Can you help me practice ordering food?"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                      <span>"Tell me about your favorite hobby"</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </ScrollArea>
    </div>
  );
};

export default VoiceChat;
