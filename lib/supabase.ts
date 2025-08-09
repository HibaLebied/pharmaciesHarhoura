import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ← indispensable
    autoRefreshToken: true, // ← indispensable
  },
});

// Client pour le serveur
export const createServerClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  phone?: string;
  opening_hours: Record<string, string>;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
