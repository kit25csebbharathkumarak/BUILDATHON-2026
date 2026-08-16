import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Sparkles, Activity } from 'lucide-react'

const prisma = new PrismaClient()

export default async function AdminInsightsPage() {
  const insights = await prisma.aIInsight.findMany({
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { generatedAt: 'desc' },
    take: 20
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary-red" />
            AI Insights & Monitoring
          </h1>
          <p className="text-ink/60 mt-2">Monitor EduPortal AI Engine activity and automated interventions.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Run System Analysis
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[100px]">Time</TableHead>
                <TableHead className="w-[140px]">Insight Type</TableHead>
                <TableHead>Target Student</TableHead>
                <TableHead>AI Output / Context</TableHead>
                <TableHead className="text-right">Action Taken</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insights.map(insight => {
                return (
                  <TableRow key={insight.id}>
                    <TableCellMono className="text-ink/50 text-xs">
                      {insight.generatedAt.toLocaleDateString()}<br/>
                      {insight.generatedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </TableCellMono>
                    <TableCell>
                      {insight.type === 'AT_RISK' && <Badge variant="default">At Risk</Badge>}
                      {insight.type === 'WEAK_SUBJECT' && <Badge variant="warning">Weak Subject</Badge>}
                      {insight.type === 'RECOMMENDATION' && <Badge variant="success">Recommendation</Badge>}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-ink">{insight.user.name || 'Unknown'}</div>
                      <div className="text-xs text-ink/60">{insight.user.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-ink/80 max-w-md truncate">
                        {insight.content}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="h-7 text-xs">Review Case</Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {insights.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-ink/60">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    No AI insights have been generated yet.<br/>
                    The engine will automatically flag students based on grading data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
