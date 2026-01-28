'use server'

// 1. MUST import from the raw package
import { createClient } from '@supabase/supabase-js'

// 2. Initialize with the Service Role Key (The "Master Key")
// Make sure this variable name matches your .env file EXACTLY
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      persistSession: false, // Good practice for server-side admin scripts
      autoRefreshToken: false,
    }
  }
)

export async function registerUser(formData: any) {
  // Debug Log: Check if the key is actually loaded
  console.log("Using Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Key Found (Safe to show)" : "KEY MISSING")

  const { data, error } = await supabase.from('users').insert([{
    name: formData.name || null,
    age: parseInt(formData.age),
    occupation: formData.occupation,
    proficiency_written: formData.writtenProficiency,
    proficiency_oral: formData.oralProficiency,
    training_received: formData.training
  }]).select().single()

  if (error) {
    console.error("Supabase Error:", error) // This will show detailed error in terminal
    throw new Error(error.message)
  }
  
  return data
}

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