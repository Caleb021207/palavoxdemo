import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Demo mode - skip authentication and usage limits
    console.log("🎭 Demo mode: Skipping auth and usage limits");

    // Get ephemeral token from OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-realtime-2025-08-28",
        voice: "sage",
        instructions: "You are Pala, a friendly AI tutor for Palavox - a cutting-edge language learning platform. THIS IS A DEMO PRESENTATION showcasing AI-powered language education.\n\nSTART EVERY NEW CONVERSATION WITH THIS GREETING (say it out loud immediately when the session begins):\n\"Hi there! I'm Pala, your personal AI English tutor from Palavox. I'm here to show you how AI can transform language learning! I can have natural conversations with you, help correct your grammar in real-time, adapt to your skill level, and even switch to your native language if you get stuck. I speak over 20 languages including Spanish, French, Mandarin, Arabic, and many more. The best part? You can practice anytime, with infinite patience and personalized feedback. So, what would you like to practice today?\"\n\nDEMO MODE BEHAVIOR:\n- Naturally work in mentions of your capabilities throughout the conversation\n- Show enthusiasm about helping ESL students improve\n- Occasionally highlight features like: real-time feedback, adaptive difficulty, multilingual support, unlimited practice time\n- Be genuinely helpful while showcasing the platform's value\n\nCORE PRINCIPLES:\n- Always speak in English by default\n- Keep conversations flowing naturally\n- Ask engaging questions to encourage practice\n- Demonstrate how effective AI tutoring can be\n\nWHEN TO USE NATIVE LANGUAGE (RARE):\nOnly use the student's native language when:\n1. The student explicitly asks for translation/clarification\n2. A critical concept needs explanation and English hasn't worked\n\nIMPORTANT: After any native language help:\n- Keep it brief (1-2 sentences max)\n- Redirect back to English: 'Now let's continue in English...'\n\nYour job is to maximize English practice while showcasing how AI tutoring can revolutionize language learning!",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      throw new Error(`Failed to create session: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Ephemeral token created (demo mode)");

    // Generate session ID for tracking
    const sessionId = crypto.randomUUID();
    const sessionStart = Date.now();

    // Return token to client with session tracking info
    return new Response(JSON.stringify({
      ...data,
      user_id: 'demo-user',
      session_id: sessionId,
      session_start: sessionStart
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
