// Demo stub - not used in carousel demo
interface UseVoiceSpeechRecognitionProps {
  targetLanguage: string;
  onTranscriptChange?: (transcript: string) => void;
  onSendTranscript?: (transcript: string) => void;
  useWhisper?: boolean;
  multilingualMode?: boolean;
}

export const useVoiceSpeechRecognition = (_props: UseVoiceSpeechRecognitionProps) => ({
  isListening: false,
  isInitializing: false,
  isTranscribing: false,
  transcript: "",
  toggleListening: () => {},
  handleSendTranscript: (_text: string) => {},
  clearTranscript: () => {}
});
