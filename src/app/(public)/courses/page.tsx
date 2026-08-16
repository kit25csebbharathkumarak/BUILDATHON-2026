import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Courses() {
  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: { enrollments: true }
      }
    }
  });

  return (
    <div className="container py-12 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Courses</h1>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search courses..." 
            className="p-2 border border-glass-border rounded-md bg-surface-hover focus:outline-none focus:border-primary"
          />
          <select className="p-2 border border-glass-border rounded-md bg-surface-hover focus:outline-none focus:border-primary">
            <option>All Categories</option>
            <option>Computer Science</option>
            <option>Business</option>
            <option>Arts</option>
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="card p-0 overflow-hidden flex flex-col">
            <div className="h-40 bg-primary-light"></div>
            <div className="p-4 flex-1 flex flex-col">
              <span className="text-xs text-primary font-bold mb-1 uppercase">{course.category}</span>
              <h3 className="font-bold mb-2">{course.title}</h3>
              <p className="text-sm text-muted mb-4 flex-1">{course.description}</p>
              <div className="text-xs text-muted mb-4">{course._count.enrollments} Students Enrolled</div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-bold">${course.price}</span>
                <Link href={`/courses/${course.id}`} className="btn btn-outline text-sm px-3 py-1">Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
