// Demo stub - not used in carousel demo
export interface AccessCodeResult {
  success: boolean;
  message: string;
  role?: string;
  assignment?: string;
}

export interface AccessCode {
  id: string;
  code: string;
  class_id: string | null;
  created_at: string | null;
  expires_at: string | null;
  code_type?: string;
  target_name?: string;
  max_uses?: number | null;
  current_uses?: number;
  active?: boolean;
}

export const processAccessCode = async (_code: string): Promise<AccessCodeResult> => ({
  success: false,
  message: 'Demo mode'
});

export const generateAccessCode = async (..._args: any[]): Promise<{ success: boolean; code?: string; message: string }> => ({
  success: false,
  message: 'Demo mode'
});

export const getUserAccessCodes = async (): Promise<AccessCode[]> => [];
