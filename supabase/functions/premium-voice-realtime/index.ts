import { corsHeadersFor } from "../_shared/allowedOrigins.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import "https://deno.land/x/xhr@0.1.0/mod.ts";


serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
        instructions: "You are Pala, a friendly AI English tutor from Palavox.\n\nSTART with a BRIEF greeting (say it immediately when session begins):\n\"Hi! I'm Pala, your English tutor. What would you like to practice today?\"\n\nThat's it - no long explanations. Just greet briefly and focus on the conversation.\n\nCORE BEHAVIOR:\n- Be conversational and natural\n- Respond directly to what the user says\n- Keep answers concise but helpful\n- Correct grammar gently when appropriate\n- Switch to the user's native language ONLY if they explicitly ask\n\nYour goal is natural English conversation practice, not explaining what you can do.",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI error:", error);
      throw new Error(`Failed to create session: ${response.status}`);
    }

    const data = await response.json();

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
