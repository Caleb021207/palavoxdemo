// Demo stub - not used in carousel demo
export interface TTSOptions {
  text: string;
  language: string;
  useMetaMms?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export async function playTTS(_options: TTSOptions): Promise<boolean> { return false; }
export async function preloadTTS(_options: TTSOptions): Promise<boolean> { return false; }
export function createAudioFromBase64(_base64Audio: string): HTMLAudioElement { return new Audio(); }
export function trackTTSUsage(_userId: string, _language: string): void {}
export const ttsCache = { get: () => null, set: () => {}, has: () => false };
