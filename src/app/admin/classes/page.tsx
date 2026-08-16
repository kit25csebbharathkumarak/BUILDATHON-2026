import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function ManageClassesPage() {
  const classes = await prisma.class.findMany({
    include: {
      course: true,
      teacher: true,
      _count: {
        select: { students: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Classes</h1>
          <p className="text-ink/60 mt-2">Manage specific class sections, assign teachers, and enroll students.</p>
        </div>
        <Link href="/admin/classes/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Class
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          {classes.length === 0 ? (
            <div className="p-8 text-center text-ink/60">
              No classes have been created yet. Click "Create Class" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-parchment">
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map(cls => (
                  <TableRow key={cls.id}>
                    <TableCell className="font-bold text-ink">
                      {cls.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral">{cls.course.title}</Badge>
                    </TableCell>
                    <TableCell className="text-ink/80">
                      {cls.teacher.name}
                    </TableCell>
                    <TableCell className="text-ink/80 font-medium">
                      {cls._count.students} Enrolled
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/classes/${cls.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">Manage</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
