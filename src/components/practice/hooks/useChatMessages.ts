import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  translation?: string;
}

export const useChatMessages = (conversationLevel: string = "intermediate") => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [correctGrammar, setCorrectGrammar] = useState(true);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage: Message = {
      role: "user",
      content: userMessage
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Call the chat-with-tutor edge function
      const { data, error } = await supabase.functions.invoke('chat-with-tutor', {
        body: {
          message: userMessage,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          })),
          conversationLevel,
          correctGrammar,
          userLanguage: "english",
          targetLanguage: "english"
        }
      });

      if (error) {
        console.error('Error calling chat function:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
        // Remove the user message on error
        setMessages(prev => prev.slice(0, -1));
        return;
      }

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: data.content || data.reply || "I couldn't generate a response.",
        translation: data.translation
      };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setInput("");
  };

  const toggleGrammarCorrection = () => {
    setCorrectGrammar(prev => !prev);
  };

  const getPlaceholderText = () => {
    return "Type your message here...";
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSubmit,
    clearConversation,
    getPlaceholderText,
    correctGrammar,
    toggleGrammarCorrection
  };
};
