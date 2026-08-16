import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { MarginaliaNote } from '@/components/ui/MarginaliaNote'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export default async function ProgressPage() {
  const session = await getSession()

  if (!session || session.role !== 'STUDENT') {
    redirect('/login')
  }

  const aiInsights = await prisma.aIInsight.findMany({
    where: { userId: session.id },
    orderBy: { generatedAt: 'desc' },
    take: 3
  })

  // Mock data for the mastery chart
  const masteryPercentage = 78

  return (
    <div className="space-y-12 animate-fade-in">
      <header className="border-b border-ink pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl text-ink mb-2">
            Academic Mastery
          </h1>
          <p className="font-sans text-ink/70">
            Comprehensive analysis of your current standing.
          </p>
        </div>
        <div className="font-mono text-sm text-ink/60 uppercase text-right">
          <div>Report Gen: {new Date().toLocaleDateString()}</div>
          <div>ID: {session.id.substring(0, 8)}</div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-1">
          <h2 className="font-serif text-xl mb-6">Overall Performance</h2>
          
          {/* Protractor / Arch Motif */}
          <div className="bg-paper border border-ledger-line p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* SVG Arc for "Protractor" style */}
            <svg viewBox="0 0 200 100" className="w-full max-w-[240px] drop-shadow-sm mb-4">
              <path 
                d="M 10,100 A 90,90 0 0,1 190,100" 
                fill="none" 
                stroke="var(--ledger-line)" 
                strokeWidth="2" 
                strokeDasharray="4 4"
              />
              <path 
                d="M 10,100 A 90,90 0 0,1 190,100" 
                fill="none" 
                stroke="var(--sage)" 
                strokeWidth="6" 
                strokeDasharray={`calc(283 * ${masteryPercentage / 100}) 283`}
              />
              {/* Tick marks */}
              <line x1="10" y1="100" x2="20" y2="100" stroke="var(--ink)" strokeWidth="1" />
              <line x1="100" y1="10" x2="100" y2="20" stroke="var(--ink)" strokeWidth="1" />
              <line x1="190" y1="100" x2="180" y2="100" stroke="var(--ink)" strokeWidth="1" />
            </svg>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <span className="font-mono text-5xl text-ink tracking-tighter">
                {masteryPercentage}<span className="text-2xl text-ink/50">%</span>
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-ink/50 mt-1">
                Proficiency
              </span>
            </div>
          </div>
          
          <div className="mt-8 border-t border-ledger-line pt-6">
            <h3 className="font-serif text-lg mb-4 text-ink">Historical Trend</h3>
            <div className="flex items-end justify-between h-32 border-b border-ledger-line pb-2 px-2 gap-2">
              {[62, 65, 68, 71, 78].map((val, i) => (
                <div key={i} className="w-full bg-parchment border border-ledger-line relative group" style={{ height: `${val}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 font-mono text-[10px] text-ink/40 uppercase">
              <span>Sept</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="font-serif text-xl mb-6">Subject Breakdown</h2>
            <div className="border border-ledger-line bg-paper">
              <Table>
                <TableHeader className="bg-parchment">
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead className="w-[100px]">Score</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-ink">Introduction to Computer Science</TableCell>
                    <TableCellMono className="text-sage">94%</TableCellMono>
                    <TableCellMono className="text-xs text-sage uppercase">Excellent</TableCellMono>
                  </TableRow>
                  <TableRow className="relative">
                    <TableCell className="font-medium text-ink">Data Structures & Algorithms</TableCell>
                    <TableCellMono className="text-ink">78%</TableCellMono>
                    <TableCellMono className="text-xs text-ink/70 uppercase">Average</TableCellMono>
                  </TableRow>
                  <TableRow className="relative">
                    <TableCell className="font-medium text-rust">Advanced Calculus</TableCell>
                    <TableCellMono className="text-rust font-bold">62%</TableCellMono>
                    <TableCellMono className="text-xs text-rust uppercase">At Risk</TableCellMono>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            {/* AI Marginalia anchored below the table */}
            <div className="mt-6 flex justify-end pl-12 relative">
              <div className="absolute top-0 right-12 w-px h-8 bg-marigold/30 -mt-6"></div>
              <MarginaliaNote tone="warning" className="max-w-md text-left shadow-sm">
                Calculus scores are bringing down your overall mastery arc. I've compiled a list of targeted practice problems focusing on limits and derivatives in your dashboard. 
              </MarginaliaNote>
            </div>
          </section>

          <section className="border-t border-ledger-line pt-12">
            <h2 className="font-serif text-xl mb-6">AI Diagnostics Log</h2>
            <div className="space-y-4">
              {aiInsights.length > 0 ? (
                aiInsights.map((insight) => (
                  <div key={insight.id} className="flex gap-4 p-4 border border-ledger-line bg-paper">
                    <div className="font-mono text-xs text-ink/50 w-24 shrink-0 pt-0.5">
                      {insight.generatedAt.toLocaleDateString()}
                    </div>
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wider mb-2">
                        {insight.type === 'AT_RISK' ? (
                          <span className="text-rust">⚠️ Intervention Required</span>
                        ) : insight.type === 'RECOMMENDATION' ? (
                          <span className="text-marigold">💡 Suggestion</span>
                        ) : (
                          <span className="text-ink/70">ℹ️ Observation</span>
                        )}
                      </div>
                      <p className="text-sm font-sans text-ink leading-relaxed">
                        {insight.content}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border border-dashed border-ledger-line font-mono text-sm text-ink/50">
                  No diagnostic data generated for this term yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
