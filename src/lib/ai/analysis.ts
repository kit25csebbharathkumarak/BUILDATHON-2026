import { generateAIResponse } from './gemini'

const LIVING_GRADEBOOK_PERSONA = `You are an AI embedded in an academic ledger. Your responses appear as handwritten marginalia notes next to a student's data. 
Rules:
1. Be concise (1-3 sentences max).
2. Read like a specific note from a highly observant teacher, not a template.
3. Be direct, actionable, and refer specifically to the data provided.
4. Do not use conversational filler (e.g., "Hello!", "Here is an insight:").
5. Do not use emojis.`

export async function generateStudentInsight(
  studentName: string, 
  recentGrades: { subject: string, score: number }[],
  attendanceRate: number
): Promise<{ text: string; tone: 'insight' | 'warning' | 'success' }> {
  
  const dataContext = `
    Student: ${studentName}
    Attendance Rate: ${attendanceRate}%
    Recent Grades: ${recentGrades.map(g => `${g.subject} (${g.score}%)`).join(', ')}
  `

  const prompt = `Based on this data, write a marginalia note analyzing the student's recent performance. Identify any risks, improvements, or specific study recommendations.`

  const aiText = await generateAIResponse(prompt + dataContext, LIVING_GRADEBOOK_PERSONA)
  
  let tone: 'insight' | 'warning' | 'success' = 'insight'
  
  if (attendanceRate < 80 || recentGrades.some(g => g.score < 70)) {
    tone = 'warning'
  } else if (attendanceRate > 95 && recentGrades.every(g => g.score > 85)) {
    tone = 'success'
  }

  return {
    text: aiText,
    tone
  }
}

export async function analyzeSubmission(
  submissionText: string,
  rubric: string
): Promise<string> {
  const prompt = `
    Evaluate the following student submission against the rubric. 
    Write your feedback as a short marginalia note (2-3 sentences) focused on the most critical area for improvement or the strongest point of the essay.
    
    Rubric: ${rubric}
    
    Submission: "${submissionText}"
  `

  return await generateAIResponse(prompt, LIVING_GRADEBOOK_PERSONA)
}
