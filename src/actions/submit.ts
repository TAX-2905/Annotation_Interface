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
  // FIX 1: Combine the form data to match your SQL 'knowledge_area' column
  const combinedKnowledge = `Written: ${formData.writtenProficiency}, Oral: ${formData.oralProficiency}`;

  const { data, error } = await supabase.from('users').insert([{
    name: formData.name || null,
    age: parseInt(formData.age),
    occupation: formData.occupation,
    // We map the form's proficiency fields to your DB's 'knowledge_area'
    knowledge_area: combinedKnowledge, 
    training_received: formData.training
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
    sentence_text: sentenceText,
    is_toxic: isToxic
    // sentence_id is omitted here to match your SQL
  })

  if (error) throw new Error(error.message)
  return true
}