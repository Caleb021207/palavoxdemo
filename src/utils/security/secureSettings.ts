// Demo stub - not used in carousel demo
export const getSecureSetting = async (_key: string): Promise<string | null> => null;
export const setSecureSetting = async (_key: string, _value: string, _encrypted: boolean = false): Promise<boolean> => false;
export const checkRateLimit = async (_actionType: string, _maxRequests: number = 10, _windowMinutes: number = 60): Promise<boolean> => true;
export const logSecurityEvent = async (_action: string, _details: Record<string, any> = {}, _success: boolean = true): Promise<void> => {};