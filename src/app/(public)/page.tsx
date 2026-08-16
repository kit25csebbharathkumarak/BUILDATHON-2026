import Link from 'next/link';
import { ArrowRight, Sparkles, BookOpen, Users, Star } from 'lucide-react';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-secondary opacity-10 z-0"></div>
        <div className="container relative z-10 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Master Your Future with <br/><span className="text-primary">AI-Powered Learning</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
            Experience personalized education, smart insights, and interactive courses designed to help you succeed faster and smarter.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/courses" className="btn btn-primary btn-lg">Explore Courses <ArrowRight size={20} /></Link>
            <Link href="/login" className="btn btn-outline btn-lg">Join for Free</Link>
          </div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose EduPortal AI?</h2>
            <p className="text-muted mt-2">Our AI engine adapts to your learning style.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Study Tips</h3>
              <p className="text-muted">Receive real-time, AI-generated study recommendations based on your performance and weak areas.</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Adaptive Curriculum</h3>
              <p className="text-muted">Courses that adjust their difficulty and content delivery to match your learning pace.</p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-light text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Predictive Insights</h3>
              <p className="text-muted">Identify at-risk areas before exams with our predictive performance modeling.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Courses</h2>
              <p className="text-muted mt-2">Top-rated classes handpicked for you.</p>
            </div>
            <Link href="/courses" className="text-primary font-bold hover:underline">View All</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mock Course Card */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="card overflow-hidden" style={{ padding: 0 }}>
                <div className="h-48 bg-primary-light"></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-primary">Computer Science</span>
                    <span className="flex items-center text-sm font-bold text-warning"><Star size={16} className="mr-1"/> 4.9</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Advanced Machine Learning</h3>
                  <p className="text-muted text-sm mb-4">Master neural networks and deep learning with real-world projects.</p>
                  <Link href="/courses/1" className="btn btn-outline w-full justify-center">View Course</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
