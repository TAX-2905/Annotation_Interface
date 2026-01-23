'use server';

import { createClient } from '@supabase/supabase-js';

// We need a private Admin client to fetch data securely server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchUnlabeledBatch() {
  // 1. Fetch 10 sentences where 'is_labeled' is FALSE
  // We use a Remote Procedure Call (RPC) or simple query if the dataset is small.
  // For simplicity, we fetch a batch of incomplete ones.
  
  const { data, error } = await supabase
    .from('sentences')
    .select('id, content')
    .eq('is_labeled', false) 
    .limit(10); // Batch size of 10

  if (error || !data) {
    console.error("Error fetching batch:", error);
    return [];
  }

  // 2. Shuffle them (optional, but good for randomness)
  // (Supabase returns them in order of insertion usually, unless randomized in SQL)
  return data.sort(() => Math.random() - 0.5);
}

export async function markAsLabeled(sentenceId: string) {
    // 3. Mark the sentence as "Done" so it doesn't show up again
    await supabase
      .from('sentences')
      .update({ is_labeled: true })
      .eq('id', sentenceId);
}