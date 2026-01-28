// src/actions/submit.ts
'use server'

import { createClient } from '@supabase/supabase-js'

// ⚠️ IMPORTANT: Use the SERVICE_ROLE_KEY here, not the Anon Key.
// The Service Role key bypasses RLS, allowing your server to write even if RLS blocks public access.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Action for page1.tsx (Registration)
export async function registerUser(formData: any) {
  const { data, error } = await supabase.from('users').insert([{
    name: formData.name || null,
    age: parseInt(formData.age),
    occupation: formData.occupation,
    proficiency_written: formData.writtenProficiency,
    proficiency_oral: formData.oralProficiency,
    training_received: formData.training
  }]).select().single()

  if (error) throw new Error(error.message)
  return data
}

// Action for page.tsx (Labeling)
export async function saveLabel(userId: string, sentenceId: string, sentenceText: string, isToxic: boolean) {
  const { error } = await supabase.from('labels').insert({
    user_id: userId,
    sentence_id: sentenceId,
    sentence_text: sentenceText,
    is_toxic: isToxic
  })

  if (error) throw new Error(error.message)
  return true
}