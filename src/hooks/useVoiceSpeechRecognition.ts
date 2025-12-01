import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseVoiceSpeechRecognitionProps {
  targetLanguage: string;
  onTranscriptChange?: (transcript: string) => void;
  onSendTranscript?: (transcript: string) => void;
  useWhisper?: boolean;
  multilingualMode?: boolean;
}

export const useVoiceSpeechRecognition = ({
  targetLanguage,
  onTranscriptChange,
  onSendTranscript,
  useWhisper = true,
  multilingualMode = false
}: UseVoiceSpeechRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
          
          // Convert to base64 and transcribe
          setIsTranscribing(true);
          try {
            const base64Audio = await blobToBase64(audioBlob);
            
            const { data, error } = await supabase.functions.invoke("transcribe-audio", {
              body: { audio: base64Audio, language: multilingualMode ? 'auto' : targetLanguage }
            });

            if (error) throw error;
            
            const transcribedText = data?.text || "";
            setTranscript(transcribedText);
            onTranscriptChange?.(transcribedText);
            
            // Don't auto-send - let user review and manually send
          } catch (error) {
            console.error("Transcription error:", error);
            toast.error("Failed to transcribe audio");
          } finally {
            setIsTranscribing(false);
          }
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (error) {
        console.error("Microphone access error:", error);
        toast.error("Could not access microphone");
      }
    }
  }, [isListening, targetLanguage, multilingualMode, onTranscriptChange, onSendTranscript]);

  const handleSendTranscript = useCallback((text: string) => {
    onSendTranscript?.(text);
    setTranscript("");
  }, [onSendTranscript]);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  const updateTranscript = useCallback((text: string) => {
    setTranscript(text);
  }, []);

  return {
    isListening,
    isInitializing: false,
    isTranscribing,
    transcript,
    toggleListening,
    handleSendTranscript,
    clearTranscript,
    updateTranscript
  };
};

// Helper function to convert blob to base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data URL prefix
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
