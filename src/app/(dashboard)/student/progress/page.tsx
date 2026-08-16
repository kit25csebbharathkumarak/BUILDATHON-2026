import { TrendingUp, Award, Brain } from 'lucide-react';

export default function MyProgress() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">My Progress & AI Insights</h1>
        <p className="text-muted mt-1">Deep dive into your academic performance.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-primary" /> Performance Overview
          </h2>
          <div className="h-64 flex items-end justify-between px-4 pb-4 border-b border-glass-border">
            {/* Mock Chart */}
            {[60, 75, 82, 90, 85, 95].map((h, i) => (
              <div key={i} className="w-12 bg-primary-light rounded-t-md flex items-end justify-center group relative" style={{ height: `${h}%` }}>
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface shadow-md p-1 rounded text-xs font-bold">{h}%</div>
                <div className="w-full bg-primary rounded-t-md opacity-80" style={{ height: '100%' }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted px-4">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-gradient-to-br from-secondary/10 to-transparent border-l-4 border-secondary">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <Brain className="text-secondary" /> Weak Subjects Identified
            </h3>
            <p className="text-sm text-muted">AI analysis shows a 12% drop in <strong>Calculus II</strong> comprehension over the last 3 weeks. Recommended action: Review Integration by Parts.</p>
            <button className="btn btn-outline btn-sm mt-4 text-secondary border-secondary hover:bg-secondary hover:text-white">Start Guided Review</button>
          </div>

          <div className="card">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Award className="text-warning" /> Achievements
            </h3>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-warning/20 text-warning rounded-full flex items-center justify-center font-bold text-xl">A+</div>
              <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center font-bold text-xl">100%</div>
              <div className="w-16 h-16 bg-surface-hover text-muted border border-dashed border-glass-border rounded-full flex items-center justify-center font-bold text-xl">?</div>
            </div>
            <p className="text-xs text-muted mt-4">Maintain your current streak to unlock the 'Consistent Scholar' badge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
