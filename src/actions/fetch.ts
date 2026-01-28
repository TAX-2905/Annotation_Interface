'use server';

import { createClient } from '@supabase/supabase-js';

// ⚠️ CHECK THIS: Must use SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

export async function fetchUnlabeledBatch() {
  const { data, error } = await supabase
    .from('sentences')
    .select('id, content')
    .eq('is_labeled', false) 
    .limit(10); 

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }

  return (data || []).sort(() => Math.random() - 0.5);
}

export async function markAsLabeled(sentenceId: string) {
    const { error } = await supabase
      .from('sentences')
      .update({ is_labeled: true })
      .eq('id', sentenceId);
      
    if (error) console.error("Update Error:", error);
}