'use server';

import { createClient } from '@supabase/supabase-js';

// ⚠️ FIXED: Using SERVICE_ROLE_KEY to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // <--- THIS IS THE FIX
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

export async function fetchUnlabeledBatch() {
  console.log("Fetching batch with Admin Key..."); // Debug log

  const { data, error } = await supabase
    .from('sentences')
    .select('id, content')
    .eq('is_labeled', false) 
    .limit(10); 

  if (error) {
    console.error("Supabase Error:", error);
    return [];
  }

  // Debug: Check if we actually got data
  console.log(`Found ${data?.length || 0} sentences.`);

  // Shuffle
  return (data || []).sort(() => Math.random() - 0.5);
}

export async function markAsLabeled(sentenceId: string) {
    const { error } = await supabase
      .from('sentences')
      .update({ is_labeled: true })
      .eq('id', sentenceId);
      
    if (error) {
        console.error("Error marking sentence as labeled:", error);
    }
}