import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalization } from "@/context/LocalizationContext";
import { Loader2, Send } from "lucide-react";
import { TranscriptDisplayProps } from "@/types/voiceChat";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ 
  transcript, 
  isListening, 
  isTranscribing = false,
  onSend,
  onTranscriptChange
}) => {
  const { t } = useLocalization();

  const handleSend = () => {
    if (transcript.trim() && onSend) {
      onSend(transcript);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
        {isTranscribing ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-base italic">
              {t("processing") || "Processing your speech"}...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              value={transcript}
              onChange={(e) => onTranscriptChange?.(e.target.value)}
              className="min-h-[80px] text-base bg-background"
              placeholder="Type or speak your message here..."
            />
            <Button 
              onClick={handleSend}
              className="w-full"
              disabled={!transcript.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TranscriptDisplay;
