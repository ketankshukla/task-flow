import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type SupabaseTodo = Database["public"]["Tables"]["todos"]["Row"];
export type SupabaseSubtask = Database["public"]["Tables"]["subtasks"]["Row"];
export type TodoInsert = Database["public"]["Tables"]["todos"]["Insert"];
export type SubtaskInsert = Database["public"]["Tables"]["subtasks"]["Insert"];
