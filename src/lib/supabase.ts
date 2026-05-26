import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string)?.trim();

if (!supabaseUrl || !/^https?:\/\//.test(supabaseUrl)) {
  throw new Error('VITE_SUPABASE_URL is missing or invalid. Make sure it is set to https://<project>.supabase.co');
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY is missing. Make sure the anon public key is set correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
