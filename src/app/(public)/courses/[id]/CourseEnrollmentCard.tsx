'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { enrollInCourseAction, dropCourseAction } from '@/app/actions/courses'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, ArrowRight, Loader2, BookOpen, AlertCircle } from 'lucide-react'

interface CourseEnrollmentCardProps {
  courseId: string
  courseTitle: string
  price: number
  isLoggedIn: boolean
  isStudent: boolean
  isEnrolled: boolean
  userRole?: string
}

export function CourseEnrollmentCard({
  courseId,
  courseTitle,
  price,
  isLoggedIn,
  isStudent,
  isEnrolled,
  userRole
}: CourseEnrollmentCardProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [enrolledState, setEnrolledState] = useState(isEnrolled)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await enrollInCourseAction(courseId)
      if (res?.error) {
        setError(res.error)
      } else {
        setEnrolledState(true)
        router.refresh()
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = async () => {
    if (!window.confirm(`Are you sure you want to drop "${courseTitle}"?`)) return
    setLoading(true)
    try {
      const res = await dropCourseAction(courseId)
      if (res?.error) {
        setError(res.error)
      } else {
        setEnrolledState(false)
        router.refresh()
      }
    } catch (err) {
      setError('Failed to drop course.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sticky top-24 bg-white border border-ledger-line rounded-lg p-6 shadow-sm">
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-ledger-line">
        <span className="text-sm font-medium text-ink/60">Tuition Fee</span>
        <span className="font-mono text-3xl font-bold text-ink">
          {price === 0 ? 'FREE' : `$${price.toFixed(2)}`}
        </span>
      </div>

      {error && (
        <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* State: Not logged in */}
      {!isLoggedIn && (
        <div className="space-y-3">
          <Link href={`/login?from=/courses/${courseId}`} className="block w-full">
            <Button className="w-full py-3 text-base font-semibold flex items-center justify-center gap-2">
              <span>Sign In to Enroll</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-xs text-center text-ink/50">
            Don't have an account? <Link href="/register" className="text-primary-red hover:underline font-medium">Register here</Link>
          </p>
        </div>
      )}

      {/* State: Logged in as Student and Enrolled */}
      {isLoggedIn && isStudent && enrolledState && (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-semibold">You are enrolled in this course</span>
          </div>

          <Link href="/dashboard/assignments" className="block w-full">
            <Button className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
              <BookOpen className="w-4 h-4" />
              <span>Go to Course Assignments</span>
            </Button>
          </Link>

          <Link href="/dashboard/courses" className="block w-full">
            <Button variant="outline" className="w-full">
              View in My Courses
            </Button>
          </Link>

          <button
            onClick={handleDrop}
            disabled={loading}
            className="w-full text-xs text-ink/40 hover:text-red-600 transition-colors py-1"
          >
            {loading ? 'Processing...' : 'Drop Course'}
          </button>
        </div>
      )}

      {/* State: Logged in as Student and NOT Enrolled */}
      {isLoggedIn && isStudent && !enrolledState && (
        <div className="space-y-4">
          <Button
            onClick={handleEnroll}
            disabled={loading}
            className="w-full py-3 text-base font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Enrolling...</span>
              </>
            ) : (
              <>
                <span>Enroll in Course Now</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
          <p className="text-xs text-center text-ink/60">
            Instant academic access • Syllabus & Materials included
          </p>
        </div>
      )}

      {/* State: Logged in as Teacher or Admin */}
      {isLoggedIn && !isStudent && (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-xs">
            Viewing course as <strong>{userRole || 'Staff'}</strong>.
          </div>
          {userRole === 'ADMIN' ? (
            <Link href={`/admin/courses/${courseId}/edit`} className="block w-full">
              <Button variant="outline" className="w-full">
                Edit Course in Admin
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard" className="block w-full">
              <Button variant="outline" className="w-full">
                Go to Teacher Dashboard
              </Button>
            </Link>
          )}
        </div>
      )}

      <hr className="border-ledger-line my-6" />

      <h4 className="font-semibold text-xs uppercase tracking-wider text-ink/70 mb-3">Course Includes</h4>
      <ul className="space-y-2 text-xs text-ink/70">
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-red"></span>
          Full Semester Curriculum & Syllabus
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-red"></span>
          Automated AI-Powered Homework Feedback
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-red"></span>
          Scheduled Live Classes & Attendance
        </li>
        <li className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-red"></span>
          Academic Performance Tracking
        </li>
      </ul>
    </div>
  )
}
