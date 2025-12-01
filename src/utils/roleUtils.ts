// Demo stub - not used in carousel demo
export type AppRole = 'admin' | 'moderator' | 'user';
export type LegacyRole = 'student' | 'teacher' | 'admin' | 'district';

export const hasRole = async (_userId: string, _role: AppRole): Promise<boolean> => false;
export const currentUserHasRole = async (_role: AppRole): Promise<boolean> => false;
export const getDisplayRole = async (_userId: string): Promise<LegacyRole | null> => null;
export const hasAnyRole = async (_userId: string, _roles: AppRole[]): Promise<boolean> => false;
export const hasAllRoles = async (_userId: string, _roles: AppRole[]): Promise<boolean> => false;
export const roleCheckExample = '';
