import { Users, BookOpen, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted mt-1">Platform overview and AI monitoring.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light text-primary rounded-full flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">1,248</div>
            <div className="text-sm text-muted">Total Students</div>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-success/20 text-success rounded-full flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">86</div>
            <div className="text-sm text-muted">Active Courses</div>
          </div>
        </div>
        <div className="card flex items-center gap-4 border-l-4 border-danger">
          <div className="w-12 h-12 bg-danger/20 text-danger rounded-full flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-danger">12</div>
            <div className="text-sm text-muted">At-Risk Students</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">AI At-Risk Student Detection</h2>
          <button className="text-primary font-bold hover:underline text-sm">View Full Report</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="p-3 font-bold text-muted">Student Name</th>
                <th className="p-3 font-bold text-muted">Course</th>
                <th className="p-3 font-bold text-muted">Risk Factor</th>
                <th className="p-3 font-bold text-muted">AI Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-glass-border hover:bg-surface-hover">
                <td className="p-3">Sarah Jenkins</td>
                <td className="p-3">Physics 101</td>
                <td className="p-3"><span className="badge bg-danger/20 text-danger">High (Missed 3 assignments)</span></td>
                <td className="p-3">Schedule automated intervention email.</td>
              </tr>
              <tr className="border-b border-glass-border hover:bg-surface-hover">
                <td className="p-3">Michael Chang</td>
                <td className="p-3">Data Structures</td>
                <td className="p-3"><span className="badge badge-warning">Medium (Low quiz scores)</span></td>
                <td className="p-3">Assign remedial practice modules.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
