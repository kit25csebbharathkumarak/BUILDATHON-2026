import { PrismaClient } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableCellMono, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'

const prisma = new PrismaClient()

export default async function ManageCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { teacher: true }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">Manage Courses & Classes</h1>
          <p className="text-ink/60 mt-2">Oversee all active subjects and curriculums.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Course
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-parchment">
              <TableRow>
                <TableHead className="w-[100px]">Course Code</TableHead>
                <TableHead>Course Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map(course => (
                <TableRow key={course.id}>
                  <TableCellMono className="text-ink/50 text-xs uppercase">
                    {course.category.substring(0,3)}-101
                  </TableCellMono>
                  <TableCell className="font-bold text-ink">
                    {course.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="neutral">{course.category}</Badge>
                  </TableCell>
                  <TableCell className="text-ink/80">
                    {course.teacher.name || course.teacher.email}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs">Manage</Button>
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
