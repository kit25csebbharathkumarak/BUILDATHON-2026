import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Search, UserPlus } from 'lucide-react'

const prisma = new PrismaClient()

export default async function ManageTeachersPage() {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Teachers</h1>
          <p className="text-ink/60 mt-2">View and manage all faculty accounts.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input 
              type="text" 
              placeholder="Search teachers..." 
              className="pl-9 pr-4 py-2 border border-ledger-line rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary-red"
            />
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Add Faculty
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[120px]">Faculty ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map(teacher => (
                <TableRow key={teacher.id}>
                  <TableCellMono className="text-ink/50 text-xs">
                    {teacher.id.substring(0, 8)}
                  </TableCellMono>
                  <TableCell className="font-medium text-ink">
                    {teacher.name || 'Unknown'}
                  </TableCell>
                  <TableCell className="text-ink/80">
                    {teacher.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">General</Badge>
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
