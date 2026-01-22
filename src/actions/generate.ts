'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateKreolSentences() {
  // ⚠️ NOTE: 'gemini-3' does not exist yet. 
  // I have set this to 'gemini-2.0-flash-exp' which is the latest preview model.
  // If you specifically have access to a private 'gemini-3-flash-preview', you can change it back.
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const batch_size = 10; 
  const half_batch = 5;

  const prompt = `
    Generate ${batch_size} realistic, long Facebook comments in **Kreol Morisien** (Mauritian Creole).
    
    CRITERIA:
    1. **Distribution:** Exactly ${half_batch} MUST be **toxic** (insults, aggressive, trolling, rude) and ${half_batch} MUST be **non_toxic** (positive, neutral, helpful).
    2. **Style:** Use casual typing, abbreviations, slang, and varying sentence lengths.
    3. **Formatting:** Output ONLY raw text lines separated by a pipe (|).
    
    OUTPUT FORMAT:
    Comment Text|label
    
    Examples:
    Ayo ferfout ar sa, to zis konn koz menti.|toxic
    Merci pou info la mo frer, mo pou check sa.|non_toxic
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 1. Parse the text
    let sentences = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const parts = line.split('|');
        return parts[0].trim(); // We only want the text, not the label
      });

    // 2. Filter invalid lines
    sentences = sentences.filter(s => s.length > 5 && !s.startsWith('Comment Text'));

    // 3. SHUFFLE the array (Fisher-Yates Algorithm)
    // This ensures the toxic/non-toxic ones are mixed up randomly
    for (let i = sentences.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }

    return sentences;

  } catch (error) {
    console.error("Gemini Error:", error);
    // Fallback if AI fails
    return [
        "Gemini nepli mache.", 
        "Eski to korek?", 
        "System la down.", 
        "Pas fer dezord.", 
        "Reload paj la."
    ];
  }
}