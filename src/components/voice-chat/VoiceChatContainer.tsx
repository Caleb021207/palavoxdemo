import React, { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import HintButton from "@/components/practice/HintButton";
import { useLocalization } from "@/context/LocalizationContext";
import ChatMessage from "@/components/practice/ChatMessage";
import LoadingIndicator from "@/components/practice/LoadingIndicator";
import { VoiceChatContainerProps } from "@/types/voiceChat";
import { TranslationType } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

const VoiceChatContainer: React.FC<VoiceChatContainerProps> = ({
  messages,
  isLoading,
  targetLanguage,
  onPlayAudio,
  sessionId
}) => {
  const {
    t
  } = useLocalization();
  const scrollRef = useRef<HTMLDivElement>(null);

  return <Card className="overflow-hidden mb-10">
      <ScrollArea className="h-[600px] p-8">
        {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {t("startSpeakingToSeeTranscript")}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md">
              {t("clickMicrophoneToStartRecording")}
            </p>
          </div> : <div className="space-y-8">
            {messages.map((message, index) => {
          // Filter out system messages or convert them to assistant messages
          if (message.role === "system") {
            return (
              <ChatMessage 
                key={index}
                role="assistant" 
                content={message.content} 
                translation={message.translation as TranslationType} 
                onPlayAudio={onPlayAudio}
                grammarCorrectionEnabled={message.grammarCorrectionEnabled}
              />
            );
          }
          return (
            <ChatMessage 
              key={index}
              role={message.role as "user" | "assistant"} 
              content={message.content} 
              translation={message.translation as TranslationType} 
              onPlayAudio={onPlayAudio}
              grammarCorrectionEnabled={message.grammarCorrectionEnabled}
            />
          );
        })}
            
            {isLoading && <LoadingIndicator />}
            
            <div ref={scrollRef} />
          </div>}
      </ScrollArea>
      
      
    </Card>;
};
export default VoiceChatContainer;