import { getSession } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function MyCoursesPage() {
  const session = await getSession()

  if (!session || session.role !== 'STUDENT') {
    redirect('/login')
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.id },
    include: {
      course: {
        include: { teacher: true }
      }
    }
  })

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">My Courses</h1>
        <p className="text-ink/60 mt-2">Manage your active course enrollments.</p>
      </div>

      {enrollments.length === 0 ? (
        <EmptyState 
          title="No Active Courses" 
          description="You are not currently enrolled in any courses for this semester."
          actionLabel="Browse Catalog"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="h-32 bg-accent-red flex items-center justify-center border-b border-ledger-line">
                <span className="text-4xl font-bold text-primary-red/20 uppercase tracking-tighter">
                  {enrollment.course.category}
                </span>
              </div>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="default">{enrollment.course.category}</Badge>
                </div>
                <h3 className="text-xl font-bold text-ink mb-1 line-clamp-2">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-ink/60 mb-6">
                  Instructor: {enrollment.course.teacher.name}
                </p>
                
                <div className="mt-auto pt-4 border-t border-ledger-line flex gap-2">
                  <Link href={`/courses/${enrollment.course.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-white">View Details</Button>
                  </Link>
                  <Link href={`/dashboard/assignments`} className="flex-1">
                    <Button variant="primary" className="w-full">Go to Work</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
