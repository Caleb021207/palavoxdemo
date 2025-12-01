// Demo stub - not used in carousel demo
export const useVoiceChat = () => ({
  isConnected: false,
  startCall: async () => {},
  endCall: async () => {},
  sendMessage: async () => {},
  startVoiceConversation: async (_language?: string) => {},
  endVoiceConversation: async (_suppressToast?: boolean) => {},
  isConversationActive: () => false,
  conversation: null
});
