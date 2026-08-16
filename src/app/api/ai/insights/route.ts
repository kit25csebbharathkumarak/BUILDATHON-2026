import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId } = body;

    // Fetch real student data
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      include: {
        grades: { include: { assignment: { include: { course: true } } } }
      }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Prepare data for the prompt
    const academicProfile = student.grades.map(g => 
      `Course: ${g.assignment.course.title}, Assignment: ${g.assignment.title}, Score: ${g.score}`
    ).join('; ');

    // If no key is provided, return mock insights for the sake of the MVP
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-key') {
       return NextResponse.json({
         insight: `(Mock AI) Based on your profile: ${academicProfile}. You should focus on improving your recent assignment scores.`,
         riskLevel: 'Medium'
       });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an AI academic advisor. Analyze the following student performance data and provide a brief 2-sentence study recommendation, identifying any weak subjects. Data: ${academicProfile}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    return NextResponse.json({
      insight: responseText,
      riskLevel: 'Calculated by AI'
    });
  } catch (error) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
