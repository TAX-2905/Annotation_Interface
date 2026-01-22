import { createClient } from '@supabase/supabase-js';

// These environment variables must be in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// createClient creates the connection to the database
export const supabase = createClient(supabaseUrl, supabaseKey);