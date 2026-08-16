import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI client
// Ensure GEMINI_API_KEY is available in your environment variables
const apiKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(apiKey)

/**
 * Base helper to generate content from Gemini
 */
export async function generateAIResponse(prompt: string, systemInstruction?: string): Promise<string> {
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing. AI Insights will return placeholder text.')
    return 'Placeholder AI Insight: API key missing.'
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemInstruction 
    })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API Error:', error)
    return 'Error generating AI insight at this time.'
  }
}
