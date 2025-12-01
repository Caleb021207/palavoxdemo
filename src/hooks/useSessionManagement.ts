// Demo stub - not used in carousel demo
export const useSessionManagement = () => ({
  messageCount: { inputs: 0, outputs: 0 },
  setMessageCount: () => {},
  isLoggedIn: false,
  isLoading: false,
  sessionStatus: 'available' as const,
  weeklyTimeRemaining: null,
  cooldownTimeRemaining: null,
  setWeeklyTimeRemaining: () => {},
  createSession: async () => {},
  endSession: async () => false,
  formatCooldownTime: () => '0h 0m'
});
