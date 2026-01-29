'use server';

import { createClient } from '@supabase/supabase-js';

// CHANGE THIS: Use Service Role Key to bypass RLS for administrative updates
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // <--- Changed from ANON to SERVICE_ROLE
);

export async function fetchUnlabeledBatch() {
  const { data, error } = await supabase
    .from('sentences')
    .select('id, content')
    .eq('is_labeled', false) 
    .limit(10); 

  if (error || !data) {
    console.error("Error fetching batch:", error);
    return [];
  }

  return data.sort(() => Math.random() - 0.5);
}

export async function markAsLabeled(sentenceId: string) {
    // Because we are using the Service Role Key above, 
    // this UPDATE will succeed even though RLS blocks public updates.
    const { error } = await supabase
      .from('sentences')
      .update({ is_labeled: true })
      .eq('id', sentenceId);
      
    if (error) {
        console.error("Error marking sentence as labeled:", error);
    }
}