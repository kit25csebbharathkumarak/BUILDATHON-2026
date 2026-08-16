import { PrismaClient } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Search, UserPlus } from 'lucide-react'

const prisma = new PrismaClient()

export default async function ManageStudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Students</h1>
          <p className="text-ink/60 mt-2">View and manage all student accounts.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-9 pr-4 py-2 border border-ledger-line rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-red"
            />
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[120px]">Student ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(student => (
                <TableRow key={student.id}>
                  <TableCellMono className="text-ink/50 text-xs">
                    {student.id.substring(0, 8)}
                  </TableCellMono>
                  <TableCell className="font-medium text-ink">
                    {student.name || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-ink/80">
                    {student.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
