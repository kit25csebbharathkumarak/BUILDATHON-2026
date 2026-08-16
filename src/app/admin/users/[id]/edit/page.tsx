import { PrismaClient } from '@prisma/client'
import { AdminUserForm } from '../../AdminUserForm'
import { notFound } from 'next/navigation'

const prisma = new PrismaClient()

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const user = await prisma.user.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Edit User</h1>
        <p className="text-ink/60 mt-2">Update information for {user.name}.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminUserForm user={user} isEdit={true} />
      </div>
    </div>
  )
}
