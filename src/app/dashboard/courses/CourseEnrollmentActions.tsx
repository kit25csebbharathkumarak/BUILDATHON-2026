'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { enrollInCourseAction, dropCourseAction } from '@/app/actions/courses'
import { Button } from '@/components/ui/Button'
import { PlusCircle, Trash2, CheckCircle2, Loader2 } from 'lucide-react'

export function QuickEnrollButton({ 
  courseId, 
  courseTitle,
  variant = 'primary',
  className = ''
}: { 
  courseId: string
  courseTitle: string
  variant?: 'primary' | 'secondary' | 'outline'
  className?: string
}) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const router = useRouter()

  const handleEnroll = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await enrollInCourseAction(courseId)
      if (res?.error) {
        setStatus(res.error)
      } else {
        setStatus('Enrolled!')
        router.refresh()
      }
    } catch (err) {
      setStatus('Failed to enroll')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-1">
      <Button 
        onClick={handleEnroll} 
        disabled={loading || status === 'Enrolled!'}
        variant={variant}
        className={`flex items-center justify-center gap-2 ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enrolling...
          </>
        ) : status === 'Enrolled!' ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Enrolled
          </>
        ) : (
          <>
            <PlusCircle className="w-4 h-4" />
            Enroll Now
          </>
        )}
      </Button>
      {status && status !== 'Enrolled!' && (
        <span className="text-xs text-red-500 text-center">{status}</span>
      )}
    </div>
  )
}

export function DropCourseButton({ 
  courseId,
  courseTitle
}: { 
  courseId: string
  courseTitle: string
}) {
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const router = useRouter()

  const handleDrop = async () => {
    if (!confirming) {
      setConfirming(true)
      return
    }
    setLoading(true)
    try {
      await dropCourseAction(courseId)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  return (
    <div>
      {confirming ? (
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleDrop} 
            disabled={loading}
            size="sm"
            className="text-xs h-8 bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
            Confirm Drop
          </Button>
          <Button 
            onClick={() => setConfirming(false)} 
            disabled={loading}
            size="sm"
            variant="outline"
            className="text-xs h-8"
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          onClick={() => setConfirming(true)} 
          size="sm"
          variant="outline"
          className="text-xs h-8 text-ink/60 hover:text-red-600 hover:border-red-200"
          title="Drop this course"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Drop
        </Button>
      )}
    </div>
  )
}
