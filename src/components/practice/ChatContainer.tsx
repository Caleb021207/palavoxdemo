import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import EmptyChatState from "./EmptyChatState";
import LoadingIndicator from "./LoadingIndicator";

interface Message {
  role: "user" | "assistant";
  content: string;
  translation?: string;
}

interface ChatContainerProps {
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  getPlaceholderText: () => string;
  targetLanguage?: string;
}

export default function ChatContainer({
  messages,
  input,
  setInput,
  handleSubmit,
  isLoading,
  getPlaceholderText,
  targetLanguage = "spanish"
}: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="overflow-hidden">
      <ScrollArea className="h-[500px] p-4">
        {messages.length === 0 ? (
          <EmptyChatState />
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
                translation={message.translation}
              />
            ))}
            
            {isLoading && <LoadingIndicator />}
            
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t p-4">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder={getPlaceholderText()}
          messages={messages}
          targetLanguage={targetLanguage}
        />
      </div>
    </Card>
  );
}
