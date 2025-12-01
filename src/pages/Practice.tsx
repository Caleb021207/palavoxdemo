import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Sparkles, CheckCircle, BookOpen } from "lucide-react";
import NewLayout from "@/components/layout/NewLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ChatContainer from "@/components/practice/ChatContainer";
import { useChatMessages } from "@/components/practice/hooks/useChatMessages";
import { DecorativeOrbs } from "@/components/ui/decorative-elements";

const Practice = () => {
  const [grammarCorrection, setGrammarCorrection] = useState(true);
  const [conversationLevel, setConversationLevel] = useState<string>("intermediate");
  
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    getPlaceholderText
  } = useChatMessages(conversationLevel);

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
                <MessageCircle className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-palavox-teal to-accent bg-clip-text text-transparent">
                English Text Practice
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Improve your English writing and grammar through AI-powered conversations
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
                          ? "The AI will correct your grammar, vocabulary, and sentence structure"
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

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ChatContainer
                messages={messages}
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                getPlaceholderText={getPlaceholderText}
                targetLanguage="english"
              />
            </motion.div>

            {/* Info Cards */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 grid md:grid-cols-2 gap-6"
              >
                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">How It Works</h3>
                    </div>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Type your messages in English naturally</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Get instant AI feedback on grammar and vocabulary</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Learn from corrections and improve over time</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Practice at your own pace with unlimited messages</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-palavox-teal/20 to-accent/20 rounded-lg">
                        <Sparkles className="h-6 w-6 text-palavox-teal" />
                      </div>
                      <h3 className="text-xl font-semibold">Tips for Students</h3>
                    </div>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                        <span>Try to form complete sentences, even if they're simple</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                        <span>Don't worry about mistakes — they're part of learning!</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                        <span>Ask follow-up questions if you don't understand something</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-palavox-teal mt-0.5 flex-shrink-0" />
                        <span>Use newly learned words to help remember them</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </ScrollArea>
    </div>
  );
};

export default Practice;
