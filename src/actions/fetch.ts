'use server';

import { createClient } from '@supabase/supabase-js';

// We need a private Admin client to fetch data securely server-side
// ensuring we use the environment variables for the URL and Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchUnlabeledBatch() {
  // 1. Fetch 10 sentences where 'is_labeled' is FALSE
  const { data, error } = await supabase
    .from('sentences')
    .select('id, content')
    .eq('is_labeled', false) 
    .limit(10); // Batch size of 10

  if (error || !data) {
    console.error("Error fetching batch:", error);
    return [];
  }

  // 2. Shuffle them to ensure randomness
  return data.sort(() => Math.random() - 0.5);
}

export async function markAsLabeled(sentenceId: string) {
    // 3. Mark the sentence as "Done" so it doesn't show up again
    const { error } = await supabase
      .from('sentences')
      .update({ is_labeled: true })
      .eq('id', sentenceId);
      
    if (error) {
        console.error("Error marking sentence as labeled:", error);
    }
}