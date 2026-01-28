'use server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
)

export async function registerUser(formData: any) {
  const { data, error } = await supabase.from('users').insert([{
    name: formData.name || null,
    age: parseInt(formData.age),
    occupation: formData.occupation,
    // FIX: Use the actual column names from your DB
    proficiency_written: formData.writtenProficiency, 
    proficiency_oral: formData.oralProficiency,       
    training_received: formData.training
    // REMOVED: knowledge_area (because it doesn't exist in your table)
  }]).select().single()

  if (error) {
    console.error("Supabase Error:", error)
    throw new Error(error.message)
  }
  
  return data
}

export async function saveLabel(userId: string, sentenceId: string, sentenceText: string, isToxic: boolean) {
  // FIX 2: We REMOVE 'sentence_id' from this insert because your SQL table doesn't have that column.
  const { error } = await supabase.from('labels').insert({
    user_id: userId,
	sentence_id: sentenceId,
    sentence_text: sentenceText,
    is_toxic: isToxic
    // sentence_id is omitted here to match your SQL
  })

  if (error) throw new Error(error.message)
  return true
}