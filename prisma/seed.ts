import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.grade.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Users
  const alex = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
      role: 'student',
    },
  });

  const turing = await prisma.user.create({
    data: {
      name: 'Dr. Alan Turing',
      email: 'turing@example.com',
      password: hashedPassword,
      role: 'teacher',
    },
  });

  // Create Courses
  const mlCourse = await prisma.course.create({
    data: {
      title: 'Advanced Machine Learning',
      description: 'Master neural networks and deep learning with real-world projects.',
      category: 'Computer Science',
      price: 99.0,
      rating: 4.9,
      teacherId: turing.id,
    },
  });

  const dsCourse = await prisma.course.create({
    data: {
      title: 'Data Structures',
      description: 'Fundamental data structures and algorithms.',
      category: 'Computer Science',
      price: 49.0,
      rating: 4.5,
      teacherId: turing.id,
    },
  });

  // Create Enrollments
  await prisma.enrollment.create({
    data: {
      userId: alex.id,
      courseId: mlCourse.id,
      progress: 40,
    },
  });

  await prisma.enrollment.create({
    data: {
      userId: alex.id,
      courseId: dsCourse.id,
      progress: 75,
    },
  });

  // Create Assignments
  const mlProject = await prisma.assignment.create({
    data: {
      title: 'React Final Project',
      type: 'Project',
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      courseId: mlCourse.id,
    },
  });

  const dsQuiz = await prisma.assignment.create({
    data: {
      title: 'Binary Trees Quiz',
      type: 'Quiz',
      dueDate: new Date(Date.now() + 86400000 * 2), // Day after tomorrow
      courseId: dsCourse.id,
    },
  });

  // Create Grades
  await prisma.grade.create({
    data: {
      score: 85,
      feedback: 'Good work, but review balancing algorithms.',
      userId: alex.id,
      assignmentId: dsQuiz.id,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
