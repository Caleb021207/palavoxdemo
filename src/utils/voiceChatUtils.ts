// Demo stub - not used in carousel demo
export const getCurrentWeekStart = (): Date => new Date();
export const formatTime = (seconds: number): string => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
export const formatCooldownTime = (_seconds: number): string => '0h 0m';
export const calculateRemainingMonthlyTime = async (_userId: string): Promise<number> => 6000;
export const calculateRemainingWeeklyTime = async (_userId: string): Promise<number> => 600;
export const scheduleVoiceSessionCleanup = async () => ({ success: true });
