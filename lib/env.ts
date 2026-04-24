const requiredEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
};

export function hasSupabaseEnv() {
  return Boolean(requiredEnv.supabaseUrl && requiredEnv.supabasePublishableKey);
}

export function getSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are missing.");
  }

  return {
    url: requiredEnv.supabaseUrl as string,
    publishableKey: requiredEnv.supabasePublishableKey as string,
  };
}

export function hasGeminiEnv() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function getGeminiApiKey() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  return process.env.GEMINI_API_KEY;
}
