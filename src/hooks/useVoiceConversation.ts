// Demo stub - not used in carousel demo
export const useVoiceConversation = (_conversationLevel?: string, _correctGrammar?: boolean) => ({
  conversationHistory: [],
  apiConversationHistory: [],
  isLoading: false,
  sendMessage: async (_text: string, _speakResponse: (text: string) => Promise<void>) => {},
  clearConversation: async () => {},
  handleAnalyzeConversation: async () => {},
  sessionIdRef: { current: null },
  hasAnalyzedConversation: false
});
