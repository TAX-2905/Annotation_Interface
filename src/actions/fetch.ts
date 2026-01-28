'use server';

import { createClient } from '@supabase/supabase-js';

// 1. Initialize with Service Role Key (Admin)
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
  // 2. Query the 'sentences' table
  // (Make sure this table actually exists in your DB!)
  const { data, error } = await supabase
    .from('sentences')
    .select('id, content')
    .eq('is_labeled', false) 
    .limit(10); 

  if (error) {
    console.error("Fetch Error:", error);
    return [];
  }

  // 3. Shuffle (Optional, keeps it random)
  return (data || []).sort(() => Math.random() - 0.5);
}

export async function markAsLabeled(sentenceId: string) {
    // 4. Update the 'sentences' table to mark as done
    const { error } = await supabase
      .from('sentences')
      .update({ is_labeled: true })
      .eq('id', sentenceId);
      
    if (error) {
        console.error("Update Error:", error);
    }
}