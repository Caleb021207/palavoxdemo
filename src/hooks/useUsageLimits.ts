// Demo stub - not used in carousel demo
export const useUsageLimits = () => ({
  loading: false,
  isLoading: false,
  limits: null,
  usageLimits: null,
  hasReachedLimit: false,
  premiumVoiceMinutesRemaining: 0,
  canStartVoiceSession: async () => true,
  canSendTextMessage: async () => true,
  trackVoiceUsage: async () => {},
  trackTextUsage: async () => {},
  trackTextMessage: async () => {},
  checkCanSendTextMessage: async () => ({ allowed: true }),
  checkCanStartVoiceSession: async () => ({ allowed: true, reason: '' }),
  refreshLimits: async () => {}
});
