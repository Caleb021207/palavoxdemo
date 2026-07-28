import { enforceAiRateLimit } from "../_shared/rateLimit.ts";
import { corsHeadersFor } from "../_shared/allowedOrigins.ts";

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


// Map language names to OpenAI voices
const languageToVoiceMap: Record<string, string> = {
  'spanish': 'alloy',
  'english': 'alloy',
  'portuguese': 'nova',
  'french': 'shimmer',
  'german': 'onyx',
  'italian': 'echo',
  'japanese': 'fable',
  'korean': 'alloy',
  'mandarin': 'nova',
  'chinese': 'nova',
  'russian': 'onyx',
  'arabic': 'echo',
  'hindi': 'shimmer',
  'urdu': 'alloy',
  'bengali': 'nova',
  'gujarati': 'shimmer',
  'punjabi': 'alloy',
  'nepali': 'nova',
  'thai': 'echo',
};

serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const limited = await enforceAiRateLimit(req, corsHeaders);
  if (limited) return limited;

  try {
    const { text, voice = 'alloy', language, speechRate = 1.0, userId } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    // Check TTS token usage limits if userId is provided
    if (userId) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { data: limits, error: limitsError } = await supabaseClient
        .from('student_usage_limits')
        .select('tts_tokens_used_current_month, tts_tokens_monthly_limit')
        .eq('student_id', userId)
        .single();

      if (limits && limits.tts_tokens_used_current_month >= limits.tts_tokens_monthly_limit) {
        console.log(`TTS token limit reached for user ${userId}: ${limits.tts_tokens_used_current_month}/${limits.tts_tokens_monthly_limit}`);
        return new Response(
          JSON.stringify({ 
            useFallback: true,
            reason: 'TTS monthly token limit reached',
            tokensUsed: limits.tts_tokens_used_current_month,
            tokensLimit: limits.tts_tokens_monthly_limit
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    console.log(`TTS request - text length: ${text.length}, voice: ${voice}, language: ${language}, rate: ${speechRate}`);

    // Determine which voice to use
    let selectedVoice = voice;
    if (language) {
      selectedVoice = languageToVoiceMap[language.toLowerCase()] || 'alloy';
    }

    console.log(`Using OpenAI voice: ${selectedVoice}`);

    // Generate speech using OpenAI TTS
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: selectedVoice,
        speed: speechRate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI TTS error:', errorText);
      throw new Error(`OpenAI TTS failed: ${errorText}`);
    }

    // Convert audio to base64 (process in chunks to avoid call stack overflow)
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    const chunkSize = 0x8000; // 32KB chunks
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    const base64Audio = btoa(binary);

    console.log("Successfully generated speech with OpenAI TTS");

    // Track TTS token usage if userId is provided
    if (userId) {
      const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Estimate tokens: approximately 4 characters = 1 token
      const estimatedTokens = Math.ceil(text.length / 4);
      
      try {
        // Track to api_calls_tracking for logging
        await supabaseClient
          .from('api_calls_tracking')
          .insert({
            service: 'openai_tts',
            endpoint: 'text-to-speech',
            user_id: userId
          });

        // Update TTS token usage
        await supabaseClient.rpc('increment_tts_token_usage', {
          p_user_id: userId,
          p_tokens: estimatedTokens
        });
      } catch (trackError) {
        console.error('Error tracking TTS usage:', trackError);
        // Don't fail the request if tracking fails
      }
    }

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in text-to-speech function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate speech. Please try again.',
        details: error instanceof Error ? error.message : String(error) 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
