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
    
    setIsLoading(true);

    try {
      // Call chat-with-tutor edge function
      // Edge function expects: message (current text) + conversationHistory (previous messages)
      // Use current apiConversationHistory state (doesn't include the message we're about to send)
      const { data, error } = await supabase.functions.invoke("chat-with-tutor", {
        body: {
          message: text,
          conversationHistory: apiConversationHistory,
          conversationLevel: conversationLevel || "intermediate",
          correctGrammar: correctGrammar || false,
          targetLanguage: "english",
          userLanguage: "english"
        }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw error;
      }

      // Validate response has content
      const replyContent = data?.reply || data?.response;
      if (!replyContent || typeof replyContent !== 'string') {
        console.error("Invalid response from edge function:", data);
        throw new Error("Invalid response format from AI");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: replyContent
      };

      // Update histories with both user message and assistant response
      setConversationHistory(prev => [...prev, userMessage, assistantMessage]);
      setApiConversationHistory(prev => [...prev, userMessage, assistantMessage]);

      // Auto-play TTS for the response
      await speakResponse(assistantMessage.content);

    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get response from AI");
      
      // Still add user message to history even if request failed
      setConversationHistory(prev => [...prev, userMessage]);
      setApiConversationHistory(prev => [...prev, userMessage]);
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
