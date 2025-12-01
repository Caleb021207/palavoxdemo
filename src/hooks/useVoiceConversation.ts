import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { playTTS } from "@/utils/tts/supabaseTTS";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export const useVoiceConversation = (conversationLevel?: string, correctGrammar?: boolean) => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [apiConversationHistory, setApiConversationHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzedConversation, setHasAnalyzedConversation] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(async (text: string, speakResponse: (text: string) => Promise<void>) => {
    if (!text.trim()) return;

    // Add user message to history
    const userMessage: Message = { role: "user", content: text };
    setConversationHistory(prev => [...prev, userMessage]);
    setApiConversationHistory(prev => [...prev, userMessage]);

    setIsLoading(true);

    try {
      // Call chat-with-tutor edge function
      const { data, error } = await supabase.functions.invoke("chat-with-tutor", {
        body: {
          messages: [...apiConversationHistory, userMessage],
          conversationLevel: conversationLevel || "intermediate",
          correctGrammar: correctGrammar || false
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response
      };

      // Add assistant response to history
      setConversationHistory(prev => [...prev, assistantMessage]);
      setApiConversationHistory(prev => [...prev, assistantMessage]);

      // Auto-play TTS for the response
      await speakResponse(data.response);

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI");
    } finally {
      setIsLoading(false);
    }
  }, [apiConversationHistory, conversationLevel, correctGrammar]);

  const clearConversation = useCallback(async () => {
    setConversationHistory([]);
    setApiConversationHistory([]);
    setHasAnalyzedConversation(false);
    sessionIdRef.current = null;
    toast.success("Conversation cleared");
  }, []);

  const handleAnalyzeConversation = useCallback(async () => {
    // Not needed for demo - stub
    console.log("Analysis not implemented in demo");
  }, []);

  return {
    conversationHistory,
    apiConversationHistory,
    isLoading,
    sendMessage,
    clearConversation,
    handleAnalyzeConversation,
    sessionIdRef,
    hasAnalyzedConversation
  };
};
