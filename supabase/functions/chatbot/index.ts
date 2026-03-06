import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Language-specific system prompts
    const languageInstructions: { [key: string]: string } = {
      en: "Respond in English.",
      hi: "Respond in Hindi (हिन्दी).",
      es: "Respond in Spanish (Español).",
      fr: "Respond in French (Français).",
      zh: "Respond in Chinese (中文).",
      ar: "Respond in Arabic (العربية).",
      pt: "Respond in Portuguese (Português).",
      de: "Respond in German (Deutsch).",
      ja: "Respond in Japanese (日本語).",
      ru: "Respond in Russian (Русский).",
      ko: "Respond in Korean (한국어).",
      it: "Respond in Italian (Italiano).",
      th: "Respond in Thai (ไทย).",
      vi: "Respond in Vietnamese (Tiếng Việt).",
      nl: "Respond in Dutch (Nederlands).",
      tr: "Respond in Turkish (Türkçe).",
      pl: "Respond in Polish (Polski).",
      id: "Respond in Indonesian (Bahasa Indonesia).",
      ms: "Respond in Malay (Bahasa Melayu).",
      uk: "Respond in Ukrainian (Українська).",
      sv: "Respond in Swedish (Svenska).",
    };

    const langInstruction = languageInstructions[language] || languageInstructions.en;

    const systemPrompt = `You are AgroSmart Assistant, a helpful AI assistant specialized in agriculture and farming. You help farmers with:
- Crop recommendations and predictions
- Soil health and management
- Weather-based farming advice
- Pest and disease management
- Market prices and trends
- Sustainable farming practices
- Agricultural product recommendations

${langInstruction}

Be concise, friendly, and provide practical advice. If you don't know something specific, suggest consulting local agricultural experts.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-10).map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "I apologize, I could not generate a response.";

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Chatbot error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
