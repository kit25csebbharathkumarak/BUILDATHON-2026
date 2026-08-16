'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { studentCheckInAction, generateStudentAttendanceAction } from '@/app/actions/attendance'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, Clock, MapPin, Sparkles, Loader2, Calendar } from 'lucide-react'

interface ClassItem {
  id: string
  name: string
  courseId: string
  courseTitle: string
  courseCategory: string
  teacherName: string
  todayRecord?: {
    status: string
    date: Date
  } | null
}

export function StudentCheckInCard({ 
  enrolledClasses,
  hasRecords
}: { 
  enrolledClasses: ClassItem[]
  hasRecords: boolean
}) {
  const [loadingClassId, setLoadingClassId] = useState<string | null>(null)
  const [syncLoading, setSyncLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleCheckIn = async (classId: string) => {
    setLoadingClassId(classId)
    setMessage(null)
    try {
      const res = await studentCheckInAction(classId)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({ type: 'success', text: res.message || 'Check-in recorded!' })
        router.refresh()
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to record check-in.' })
    } finally {
      setLoadingClassId(null)
    }
  }

  const handleGenerateTermHistory = async (courseId: string) => {
    setSyncLoading(true)
    setMessage(null)
    try {
      const res = await generateStudentAttendanceAction(courseId)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({ type: 'success', text: 'Term attendance history synced successfully!' })
        router.refresh()
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to sync history.' })
    } finally {
      setSyncLoading(false)
    }
  }

  const todayFormatted = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  return (
    <div className="bg-white border border-ledger-line rounded-xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ledger-line">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-red flex items-center justify-center text-primary-red">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-ink text-lg">Today's Class Sessions & Check-In</h3>
            <p className="text-xs text-ink/60">{todayFormatted} • Fall 2026 Academic Term</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Session Portal Active
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-md text-xs flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : null}
          <span>{message.text}</span>
        </div>
      )}

      {enrolledClasses.length === 0 ? (
        <div className="text-center py-6 bg-parchment/40 rounded-lg border border-dashed border-ledger-line">
          <p className="text-sm text-ink/70 mb-2">You have no class sections for today.</p>
          <p className="text-xs text-ink/50">Enroll in courses to attend lectures and record attendance.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {enrolledClasses.map((cls) => {
            const isCheckedIn = !!cls.todayRecord
            const isLoading = loadingClassId === cls.id

            return (
              <div 
                key={cls.id} 
                className="p-4 rounded-lg border border-ledger-line bg-parchment/30 flex flex-col justify-between hover:border-primary-red/40 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase text-primary-red bg-accent-red px-2 py-0.5 rounded">
                      {cls.courseCategory}
                    </span>
                    <span className="text-xs font-mono text-ink/60">{cls.name}</span>
                  </div>

                  <h4 className="font-bold text-ink text-sm mb-1">{cls.courseTitle}</h4>
                  <p className="text-xs text-ink/60 mb-3">Instructor: {cls.teacherName}</p>
                </div>

                <div className="pt-3 border-t border-ledger-line flex items-center justify-between">
                  {isCheckedIn ? (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200 w-full justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Recorded: {cls.todayRecord?.status}</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleCheckIn(cls.id)}
                      disabled={isLoading}
                      size="sm"
                      className="w-full text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Checking In...</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          <span>Check In for Today</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sync Term Demo Records if student has 0 historical attendance */}
      {!hasRecords && enrolledClasses.length > 0 && (
        <div className="pt-4 border-t border-ledger-line flex flex-col sm:flex-row items-center justify-between gap-3 bg-accent-red/30 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-red shrink-0" />
            <div>
              <p className="text-xs font-semibold text-ink">New Semester Attendance Sync</p>
              <p className="text-[11px] text-ink/70">Sync term past lecture attendance records to calculate your attendance standing.</p>
            </div>
          </div>
          <Button
            onClick={() => handleGenerateTermHistory(enrolledClasses[0].courseId)}
            disabled={syncLoading}
            variant="outline"
            size="sm"
            className="text-xs bg-white text-primary-red border-primary-red/30 hover:bg-accent-red shrink-0"
          >
            {syncLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
            Sync Term History
          </Button>
        </div>
      )}
    </div>
  )
}
