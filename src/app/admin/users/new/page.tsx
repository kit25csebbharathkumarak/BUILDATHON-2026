import { AdminUserForm } from '../AdminUserForm'

export default function NewUserPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Create New User</h1>
        <p className="text-ink/60 mt-2">Add a new student, teacher, or admin to the platform.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg border border-ledger-line shadow-sm">
        <AdminUserForm />
      </div>
    </div>
  )
}
