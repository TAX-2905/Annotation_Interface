// src/actions/submit.ts
'use server'

import { createClient } from '@supabase/supabase-js'

// Debug check: Print to terminal if keys are missing (DO NOT share these logs publicly)
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing from process.env");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function registerUser(formData: any) {
  console.log("🔹 Server Action: registerUser called", formData); // Log input

  // Safe parsing of age to prevent NaN errors
  const ageInt = parseInt(formData.age);
  if (isNaN(ageInt)) {
    console.error("❌ Error: Age is invalid");
    throw new Error("Invalid Age");
  }

  const { data, error } = await supabase.from('users').insert([{
    name: formData.name || null,
    age: ageInt,
    occupation: formData.occupation,
    proficiency_written: formData.writtenProficiency,
    proficiency_oral: formData.oralProficiency,
    training_received: formData.training
  }]).select().single()

  if (error) {
    console.error("❌ Supabase Insert Error:", error.message); // Log DB error
    throw new Error(error.message);
  }

  console.log("✅ User registered successfully:", data.id);
  return data;
}

// ... keep saveLabel as is ...
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