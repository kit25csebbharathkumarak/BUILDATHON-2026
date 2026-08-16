import { PrismaClient, Role, AIInsightType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean existing data
  await prisma.report.deleteMany()
  await prisma.aIInsight.deleteMany()
  await prisma.grade.deleteMany()
  await prisma.examResult.deleteMany()
  await prisma.exam.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.class.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // Hash common password
  const password = await bcrypt.hash('password123', 10)

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@school.edu',
      password,
      role: Role.ADMIN,
    },
  })

  // 2. Create Teachers
  const teacher1 = await prisma.user.create({
    data: {
      name: 'Sarah Smith',
      email: 'sarah.smith@school.edu',
      password,
      role: Role.TEACHER,
    },
  })

  const teacher2 = await prisma.user.create({
    data: {
      name: 'Michael Chen',
      email: 'michael.chen@school.edu',
      password,
      role: Role.TEACHER,
    },
  })

  // 3. Create Students
  const students = []
  for (let i = 1; i <= 5; i++) {
    students.push(
      await prisma.user.create({
        data: {
          name: `Student ${i}`,
          email: `student${i}@school.edu`,
          password,
          role: Role.STUDENT,
        },
      })
    )
  }

  // 4. Create Courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Computer Science',
      description: 'Learn the basics of programming and algorithms.',
      category: 'Computer Science',
      price: 0,
      rating: 4.8,
      teacherId: teacher1.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced Mathematics',
      description: 'Calculus, linear algebra, and differential equations.',
      category: 'Mathematics',
      price: 0,
      rating: 4.6,
      teacherId: teacher2.id,
    },
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'Physics 101',
      description: 'Fundamentals of mechanics and thermodynamics.',
      category: 'Science',
      price: 0,
      rating: 4.9,
      teacherId: teacher1.id,
    },
  })

  // 5. Create Classes (Sections)
  const class1 = await prisma.class.create({
    data: {
      name: 'CS101 - Fall 2026',
      courseId: course1.id,
      teacherId: teacher1.id,
    },
  })

  const class2 = await prisma.class.create({
    data: {
      name: 'MATH201 - Fall 2026',
      courseId: course2.id,
      teacherId: teacher2.id,
    },
  })

  // 6. Create Enrollments (Students 1-3 in Course 1 & 2, Students 4-5 in Course 3)
  for (let i = 0; i < 3; i++) {
    await prisma.enrollment.create({
      data: { userId: students[i].id, courseId: course1.id },
    })
    await prisma.enrollment.create({
      data: { userId: students[i].id, courseId: course2.id },
    })
  }

  for (let i = 3; i < 5; i++) {
    await prisma.enrollment.create({
      data: { userId: students[i].id, courseId: course3.id },
    })
  }

  // 7. Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Python Basics Quiz',
      description: 'Variables, loops, and functions.',
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      courseId: course1.id,
    },
  })

  // 8. Create Submissions & Grades
  for (let i = 0; i < 3; i++) {
    const score = Math.floor(Math.random() * 40) + 60 // 60-100
    await prisma.submission.create({
      data: {
        assignmentId: assignment1.id,
        studentId: students[i].id,
        content: `print('Hello World')`,
        grade: score,
        aiFeedback: score > 80 ? 'Good understanding of basic concepts.' : 'Review variables and functions.',
      },
    })
    
    // Aggregated course grade
    await prisma.grade.create({
      data: {
        score: score,
        userId: students[i].id,
        courseId: course1.id,
        feedback: 'Overall good progress.',
      },
    })
  }

  // 9. Create Attendance
  for (let i = 0; i < 3; i++) {
    await prisma.attendance.create({
      data: {
        studentId: students[i].id,
        classId: class1.id,
        date: new Date(),
        status: i === 0 ? 'LATE' : 'PRESENT',
      },
    })
  }

  // 10. Create AI Insights
  await prisma.aIInsight.create({
    data: {
      userId: students[0].id,
      type: AIInsightType.RECOMMENDATION,
      content: 'Based on recent quiz scores, reviewing Python loops would be beneficial.',
    },
  })

  console.log('Database seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
