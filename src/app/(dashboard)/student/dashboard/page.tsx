import { BookOpen, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock-key');

export default async function StudentDashboard() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  const studentEmail = session.email;
  
  const student = await prisma.user.findUnique({
    where: { email: studentEmail },
    include: {
      enrollments: { include: { course: true } },
      grades: { include: { assignment: { include: { course: true } } } }
    }
  });

  if (!student) {
    return <div>Student not found. Please run the seed script.</div>;
  }

  // Calculate stats
  const activeCourses = student.enrollments.length;
  const avgGrade = student.grades.length > 0 
    ? student.grades.reduce((acc, g) => acc + g.score, 0) / student.grades.length 
    : 0;

  // Generate AI Insight
  let aiInsight = "We need more data to generate insights.";
  if (student.grades.length > 0) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock-key') {
      aiInsight = "(Mock AI) Your recent scores suggest you should review Binary Trees.";
    } else {
      try {
        const profile = student.grades.map(g => `${g.assignment.title}: ${g.score}`).join(', ');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(`You are an AI academic advisor. Give a 1-sentence study tip based on these scores: ${profile}`);
        aiInsight = result.response.text();
      } catch (e) {
        aiInsight = "Failed to load AI insights. Check API key.";
      }
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {student.name.split(' ')[0]}!</h1>
          <p className="text-muted mt-1">Here is what's happening with your courses today.</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{activeCourses}</div>
            <div className="text-sm text-muted">Active Courses</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-warning/20 text-warning rounded-full flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-muted">Due Assignments</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">92%</div>
            <div className="text-sm text-muted">Avg Attendance</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{avgGrade > 80 ? 'A-' : 'B'}</div>
            <div className="text-sm text-muted">Current GPA</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Courses */}
          <section>
            <h2 className="text-xl font-bold mb-4">Your Courses</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {student.enrollments.map((enr) => (
                <div key={enr.id} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold">{enr.course.title}</h3>
                  </div>
                  <div className="w-full bg-surface-hover rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${enr.progress}%` }}></div>
                  </div>
                  <div className="text-xs text-muted text-right">{enr.progress}% Completed</div>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Assignments */}
          <section>
            <h2 className="text-xl font-bold mb-4">Recent Grades & Feedback</h2>
            <div className="card space-y-4">
              {student.grades.map((grade) => (
                <div key={grade.id} className="flex justify-between items-center p-3 hover:bg-surface-hover rounded-md transition-colors border border-transparent hover:border-glass-border">
                  <div>
                    <h4 className="font-bold">{grade.assignment.title}</h4>
                    <p className="text-sm text-muted">{grade.assignment.course.title} • {grade.assignment.type}</p>
                    <p className="text-xs text-muted mt-1 italic">"{grade.feedback}"</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">{grade.score}/100</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column (AI Insights) */}
        <div className="space-y-8">
          {/* AI Engine Box */}
          <section>
            <div className="card bg-gradient-to-br from-primary-light to-white border-2 border-primary-light">
              <div className="flex items-center gap-2 mb-4">
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <h2 className="text-xl font-bold text-primary">AI Insights</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-3 bg-white/60 rounded-md border border-white">
                  <h4 className="font-bold flex items-center gap-2 text-sm">
                    <AlertTriangle size={16} className="text-warning"/> Study Recommendation
                  </h4>
                  <p className="text-sm text-muted mt-2">
                    {aiInsight}
                  </p>
                  <Link href="/student/progress" className="text-primary text-xs font-bold mt-3 inline-block">View Full Study Plan &rarr;</Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
