'use server';

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: 'Invalid email or password' };
  }

  await createSession(user.id, user.role, user.email);
  
  if (user.role === 'admin') {
    redirect('/admin/dashboard');
  } else if (user.role === 'teacher') {
    redirect('/teacher/dashboard');
  } else {
    redirect('/student/dashboard');
  }
}

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as string; // 'student' or 'teacher'

  if (!name || !email || !password || !role) {
    return { error: 'All fields are required' };
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: 'Email already in use' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  await createSession(user.id, user.role, user.email);

  if (user.role === 'teacher') {
    redirect('/teacher/dashboard');
  } else {
    redirect('/student/dashboard');
  }
}

export async function logoutUser() {
  await deleteSession();
  redirect('/');
}
