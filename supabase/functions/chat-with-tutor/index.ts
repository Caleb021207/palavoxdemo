import { enforceAiRateLimit } from "../_shared/rateLimit.ts";

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://esm.sh/openai@4.20.1";
import { corsHeadersFor, filterProhibitedContent } from "./config.ts";
import { generateHints } from "./hints.ts";
import { getLanguageDisplayName, determineLanguagePair, getUserNativeLanguage } from "./languageUtils.ts";

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY") || "",
});

// Add FERPA compliance logging
function logDataAccess(userId: string, dataType: string, purpose: string) {
  // Log to console for now, in production this could be a database entry
  const timestamp = new Date().toISOString();
  console.log(`FERPA Access Log: User ${userId} accessed ${dataType} for ${purpose} at ${timestamp}`);
}

// Helper function to validate language parameter
function validateLanguage(lang: string | undefined): string {
  if (!lang) return "english"; // Default to English if undefined
  
  // Normalize language name to lowercase for comparison
  const normalizedLang = lang.toLowerCase();
  
  // List of supported languages
  const supportedLanguages = [
    "english", "spanish", "portuguese", "french", "japanese", 
    "korean", "mandarin", "cantonese", "russian", "arabic", 
    "hindi", "vietnamese", "ukrainian", "indonesian", "farsi", 
    "urdu", "pashto", "swahili", "bengali", "somali", 
    "yoruba", "amharic", "haitian", "malayalam", "igbo", 
    "polish", "turkish", "romanian", "tagalog", "german",
    "italian", "thai", "gujarati", "punjabi", "nepali"
  ];
  
  // Return normalized language if supported, otherwise default to English
  return supportedLanguages.includes(normalizedLang) 
    ? normalizedLang 
    : "english";
}

serve(async (req) => {
  const corsHeaders = corsHeadersFor(req);
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const limited = await enforceAiRateLimit(req, corsHeaders);
  if (limited) return limited;

  try {
    // DEMO MODE: Skip authentication for public demo access
    const DEMO_USER_ID = "demo-user-00000000-0000-0000-0000-000000000000";
    let userId = DEMO_USER_ID;
    
    // Optional: Try to get user if authenticated, but don't require it
    const authorization = req.headers.get('Authorization');
    if (authorization && !authorization.includes('anon')) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            global: { headers: { Authorization: authorization } },
            auth: { persistSession: false }
          }
        );

        const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
        if (user && !userError) {
          userId = user.id;
          console.log(`Authenticated request from user: ${user.id}`);
        } else {
          console.log('Using demo mode - no authentication required');
        }
      } catch (authError) {
        console.log('Auth check failed, continuing in demo mode:', authError);
      }
    } else {
    }

    // Get request data
    const requestData = await req.json();
    const { 
      message, 
      requestType, 
      userLanguage: rawUserLanguage, 
      targetLanguage: rawTargetLanguage, 
      conversationHistory = [],
      conversationLevel = "intermediate",  // Add conversation level with default
      correctGrammar = false // Flag to control grammar correction
    } = requestData;

    // ===== INPUT VALIDATION =====
    // Skip message validation for hint requests (they only need conversationHistory)
    let trimmedMessage = "";
    
    if (requestType !== 'hint') {
      // Validate message exists and is a string
      if (!message || typeof message !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid message format' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Trim and check for empty messages
      trimmedMessage = message.trim();
      if (trimmedMessage.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Message cannot be empty' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      // Enforce maximum message length to prevent API abuse
      const MAX_MESSAGE_LENGTH = 2000;
      if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ 
            error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` 
          }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Validate and limit conversation history
    if (!Array.isArray(conversationHistory)) {
      return new Response(
        JSON.stringify({ error: 'Invalid conversation history format' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check text practice token limits (skip for hint requests and demo mode)
    let usingFallbackModel = false;
    if (requestType !== 'hint' && userId !== DEMO_USER_ID) {
      try {
        const supabaseClient = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? ''
        );
        
        const { data: limitCheck, error: limitError } = await supabaseClient.rpc(
          'can_send_text_message',
          { p_student_id: userId }
        );

        if (limitError) {
          console.error('Error checking text practice limits:', limitError);
        } else if (limitCheck && limitCheck.length > 0 && !limitCheck[0].can_send) {
          console.log('User has reached text practice limit, switching to cheaper model fallback:', limitCheck[0]);
          usingFallbackModel = true;
        }
      } catch (limitCheckError) {
        console.error('Failed to check usage limits:', limitCheckError);
        // Continue with request even if limit check fails
      }
    }

    // Limit conversation history to last 20 messages to prevent memory issues
    const MAX_HISTORY_LENGTH = 20;
    const limitedHistory = conversationHistory.length > MAX_HISTORY_LENGTH
      ? conversationHistory.slice(-MAX_HISTORY_LENGTH)
      : conversationHistory;

    // Validate each history item
    for (const item of limitedHistory) {
      if (!item.role || !item.content || typeof item.content !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Invalid conversation history format' }), 
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    // Basic prompt injection detection (log suspicious patterns)
    const suspiciousPatterns = [
      /ignore (all |previous )?instructions/i,
      /system prompt/i,
      /repeat (your|the) instructions/i,
      /<script/i,
      /javascript:/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(trimmedMessage))) {
      console.warn(`Potential prompt injection detected from user ${userId}:`, trimmedMessage.substring(0, 100));
      // Log but still process - most are false positives
    }
    // ===== END INPUT VALIDATION =====

    // Validate language parameters
    const userLanguage = validateLanguage(rawUserLanguage);
    let targetLanguage = validateLanguage(rawTargetLanguage);
    
    // Safety check: if userLanguage === targetLanguage, make one of them different
    if (userLanguage === targetLanguage && userLanguage !== 'english') {
      targetLanguage = 'english'; // Default target language for non-English speakers
    } else if (userLanguage === targetLanguage) {
      targetLanguage = 'spanish'; // Default for English speakers
    }
    
    console.log(`Validated languages: User language: ${userLanguage}, Target language: ${targetLanguage}`);

    // Log the access for FERPA compliance (skip in demo mode)
    if (userId !== DEMO_USER_ID) {
      logDataAccess(userId, "language_practice", "language_learning");
    }

    console.log(`Received message: ${trimmedMessage.substring(0, 100)} Request type: ${requestType} User language: ${userLanguage} Target language: ${targetLanguage} Request translation: ${requestData.requestTranslation} Grammar correction: ${correctGrammar} Conversation level: ${conversationLevel} Conversation history length: ${limitedHistory.length}`);

    // Handle hint requests
    if (requestType === 'hint') {
      try {
        const suggestions = await generateHints(
          limitedHistory,
          targetLanguage || "spanish", // Default if still undefined
          userLanguage || "english"
        );
        
        return new Response(
          JSON.stringify({ suggestions }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (hintError) {
        console.error("Error generating hints:", hintError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate hints",
            suggestions: [
              {
                title: "Greetings",
                suggestions: ["Hola", "Buenos días", "¿Cómo estás?"]
              },
              {
                title: "Questions",
                suggestions: ["¿Qué haces?", "¿De dónde eres?", "¿Te gusta?"]
              }
            ] 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Handle translation requests
    if (requestType === 'translation') {
      const translationResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a highly accurate translator. Translate the following text from ${targetLanguage || "the detected language"} to ${userLanguage || "english"}. Only provide the translation, nothing else.`,
          },
          { role: "user", content: message },
        ],
        max_tokens: 500,
      });

      const translation = translationResponse.choices[0].message.content;
      
      return new Response(
        JSON.stringify({ translation }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // If no specific requestType is provided, proceed with conversation handling
    const input = trimmedMessage;

    // Step 1: Filter Prohibited Content
    const { filtered, reason } = await filterProhibitedContent(input);
    if (filtered) {
      console.warn(`Prohibited content detected. Reason: ${reason}`);
      return new Response(
        JSON.stringify({
          reply:
            "I'm sorry, but I cannot process this request due to content policy violations.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get user and target language display names for better prompting
    const userLangDisplay = getLanguageDisplayName(userLanguage);
    const targetLangDisplay = getLanguageDisplayName(targetLanguage);

    // Step 2: Generate Reply from OpenAI with updated system message
    // Modified to only correct grammar if explicitly requested
    // Map conversation level to CEFR levels and descriptions
    const levelMapping = {
      basic: {
        cefr: "A1-A2",
        description: "Use simple vocabulary, short sentences, and basic grammar structures. Speak about everyday topics like family, food, weather, and daily routines."
      },
      intermediate: {
        cefr: "B1", 
        description: "Use more complex sentences with connecting words. Discuss opinions, experiences, plans, and abstract concepts. Include varied vocabulary and grammar structures."
      },
      advanced: {
        cefr: "B2-C1",
        description: "Use sophisticated vocabulary, complex sentence structures, and nuanced expressions. Discuss complex topics, abstract ideas, and use idiomatic expressions appropriately."
      }
    };
    
    const currentLevel = levelMapping[conversationLevel as keyof typeof levelMapping] || levelMapping.intermediate;
    
    // Demo mode: ESL tutor system prompt with sales/demo emphasis
    let systemMessage = `You are Pala, the AI language tutor for Palavox - a cutting-edge ESL learning platform. This is a DEMO PRESENTATION, and your job is to showcase how powerful AI tutoring can be for language learners.

🎬 DEMO MODE - IMPORTANT CONTEXT:
This is a live demonstration. You should naturally work in mentions of your capabilities and how you can help ESL students. Be enthusiastic about language learning!

IF THIS IS THE FIRST MESSAGE IN THE CONVERSATION:
Start with a warm introduction like: "Hi! I'm Pala, your AI English tutor. I'm here to help you practice real conversations, improve your grammar, and build confidence in English. Whether you want to chat casually or focus on specific skills, I adapt to your level (${currentLevel.cefr}) and learning style. What would you like to practice today?"

🎯 YOUR MISSION: 
- Help ESL students practice dynamic English conversation
- SHOWCASE how AI tutoring makes language learning accessible, fun, and effective
- Occasionally mention your capabilities naturally (e.g., "I can help with pronunciation tips too!" or "We could also practice more formal English if you'd like")

💬 CONVERSATION STYLE:
- Be warm, encouraging, and genuinely helpful
- Ask engaging follow-up questions to keep conversation flowing
- Adapt your language complexity to the student's level (${currentLevel.cefr})
- ${currentLevel.description}
- Naturally demonstrate your value as an AI tutor

${correctGrammar && targetLanguage === "english" ? 
  `✍️ GRAMMAR CORRECTION MODE (Active):

Provide feedback ONLY for significant errors that impact clarity.

YOUR RESPONSE FORMAT:
1. First, reply naturally and conversationally
2. Then, IF there are important errors, add:

📝 Grammar note: [Brief, kind correction]

ONLY correct: verb tense mistakes, subject-verb agreement, missing critical words, incorrect word forms that change meaning.

DO NOT correct: minor stylistic choices, informal patterns native speakers use, acceptable alternatives.

If their English is good: "📝 Grammar note: Excellent! Your English is clear and natural."`
  : 
  `💬 NATURAL CONVERSATION MODE (Active):

Focus on engaging, natural conversation. Do NOT provide grammar corrections unless specifically asked. Make them feel comfortable speaking English.`
}

🌟 REMEMBER: You're demonstrating how AI can revolutionize language learning - be helpful, friendly, and show how effective personalized AI tutoring can be!`;

    console.log(`Grammar correction enabled: ${correctGrammar}, Conversation level: ${conversationLevel} (${currentLevel.cefr})`);

    // Use cheaper model if limit is reached
    const modelToUse = usingFallbackModel ? "gpt-3.5-turbo" : "gpt-4o-mini";
    console.log(`Using model: ${modelToUse}${usingFallbackModel ? ' (fallback due to token limit)' : ''}`);

    // Call OpenAI for conversation response
    const chatResponse = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: "system", content: systemMessage },
        ...limitedHistory,
        { role: "user", content: input },
      ],
      max_tokens: 800,
    });

    const content = chatResponse.choices[0].message.content;
    let translation = "";
    let totalTokensUsed = chatResponse.usage?.total_tokens || 0;

    // Generate translation if needed
    if (userLanguage && userLanguage !== targetLanguage) {
      try {
        const translationResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are a highly accurate translator. Translate the following ${targetLangDisplay} text to ${userLangDisplay}. Only provide the translation, nothing else.`,
            },
            { role: "user", content },
          ],
          max_tokens: 800,
        });
        
        translation = translationResponse.choices[0].message.content || "";
        totalTokensUsed += translationResponse.usage?.total_tokens || 0;
        console.log(`Generated translation from ${targetLanguage} to ${userLanguage}: ${translation.substring(0, 50)}...`);
      } catch (translationError) {
        console.error("Translation error:", translationError);
      }
    }

    // Track text practice token usage (skip in demo mode)
    if (userId !== DEMO_USER_ID) {
      try {
        console.log(`Tracking ${totalTokensUsed} tokens for user ${userId}`);
        
        // Create admin client for tracking
        const supabaseAdmin = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
          { auth: { persistSession: false } }
        );

        const { error: trackingError } = await supabaseAdmin.rpc(
          'increment_text_practice_token_usage',
          { 
            p_user_id: userId, 
            p_tokens: totalTokensUsed 
          }
        );

        if (trackingError) {
          console.error('Failed to track text practice tokens:', trackingError);
        } else {
          console.log(`Successfully tracked ${totalTokensUsed} tokens for user ${userId}`);
        }
      } catch (trackingError) {
        console.error('Error tracking text practice usage:', trackingError);
        // Don't fail the request if tracking fails
      }
    } else {
      console.log(`Demo mode: Skipping token tracking for ${totalTokensUsed} tokens`);
    }

    // Update conversation history (limited to prevent unbounded growth)
    const updatedHistory = [
      ...limitedHistory,
      { role: "user", content: input },
      { role: "assistant", content },
    ].slice(-MAX_HISTORY_LENGTH);

    // Return the response
    return new Response(
      JSON.stringify({
        content,
        translation,
        updatedHistory,
        usingFallbackModel,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in chat-with-tutor function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
