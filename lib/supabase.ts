import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL não foi definida.");
}

if (!supabaseKey) {
  throw new Error(
    "Defina NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ou NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Custom storage adapter for better reliability in Next.js
const createBrowserClient = () => {
  const storage: any = {
    getItem: (key: string) => {
      if (typeof window === "undefined") return null;
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn(`Failed to get item from localStorage: ${key}`, error);
        return null;
      }
    },
    setItem: (key: string, value: string) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn(`Failed to set item in localStorage: ${key}`, error);
      }
    },
    removeItem: (key: string) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove item from localStorage: ${key}`, error);
      }
    },
  };

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: storage,
    },
  });
};

export const supabase = createBrowserClient();