'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { markClassAttendanceAction } from '@/app/actions/attendance'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/DataTable'
import { CheckCircle2, UserCheck, Calendar, Users, Save, Loader2, AlertCircle } from 'lucide-react'

interface StudentItem {
  id: string
  name: string
  email: string
  initialStatus: string
}

interface ClassSection {
  id: string
  name: string
  courseTitle: string
  courseCategory: string
  students: StudentItem[]
}

export function TeacherAttendanceManager({ 
  classes 
}: { 
  classes: ClassSection[] 
}) {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '')
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'PRESENT' | 'LATE' | 'ABSENT'>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0]

  // Initialize roster state for current class
  const getStatusForStudent = (studentId: string, initialStatus: string) => {
    return attendanceMap[studentId] || (initialStatus as 'PRESENT' | 'LATE' | 'ABSENT') || 'PRESENT'
  }

  const handleSetStatus = (studentId: string, status: 'PRESENT' | 'LATE' | 'ABSENT') => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleMarkAll = (status: 'PRESENT' | 'LATE' | 'ABSENT') => {
    if (!currentClass) return
    const newMap: Record<string, 'PRESENT' | 'LATE' | 'ABSENT'> = { ...attendanceMap }
    currentClass.students.forEach(s => {
      newMap[s.id] = status
    })
    setAttendanceMap(newMap)
  }

  const handleSaveAttendance = async () => {
    if (!currentClass) return
    setSaving(true)
    setMessage(null)

    const rosterStatuses = currentClass.students.map(s => ({
      studentId: s.id,
      status: getStatusForStudent(s.id, s.initialStatus)
    }))

    try {
      const res = await markClassAttendanceAction(currentClass.id, selectedDate, rosterStatuses)
      if (res?.error) {
        setMessage({ type: 'error', text: res.error })
      } else {
        setMessage({ type: 'success', text: res.message || 'Attendance saved successfully!' })
        router.refresh()
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save attendance.' })
    } finally {
      setSaving(false)
    }
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white border border-dashed border-ledger-line rounded-xl p-12 text-center">
        <Users className="w-12 h-12 text-primary-red mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-ink mb-1">No Active Classes Assigned</h3>
        <p className="text-sm text-ink/60 max-w-md mx-auto">
          You currently have no class sections to record attendance for. Add classes in the Admin portal or request assignment from the administrator.
        </p>
      </div>
    )
  }

  const students = currentClass?.students || []
  const presentCount = students.filter(s => getStatusForStudent(s.id, s.initialStatus) === 'PRESENT').length
  const lateCount = students.filter(s => getStatusForStudent(s.id, s.initialStatus) === 'LATE').length
  const absentCount = students.filter(s => getStatusForStudent(s.id, s.initialStatus) === 'ABSENT').length

  return (
    <div className="space-y-6">
      {/* Selection Toolbar */}
      <div className="bg-white border border-ledger-line rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink/60 uppercase mb-1">Select Class Section</label>
            <select
              value={selectedClassId}
              onChange={(e) => {
                setSelectedClassId(e.target.value)
                setAttendanceMap({})
                setMessage(null)
              }}
              className="bg-parchment border border-ledger-line rounded-lg px-3 py-2 text-sm font-semibold text-ink focus:outline-none focus:border-primary-red"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.courseTitle}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/60 uppercase mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-parchment border border-ledger-line rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-primary-red"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button
            onClick={() => handleMarkAll('PRESENT')}
            variant="outline"
            size="sm"
            className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          >
            Mark All Present
          </Button>
          <Button
            onClick={handleSaveAttendance}
            disabled={saving}
            size="sm"
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Attendance</span>
          </Button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Roster & Stats Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Class Overview Stats */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-white border-ledger-line">
            <CardContent className="p-6">
              <h4 className="font-bold text-ink text-sm mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary-red" />
                Session Roster Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-ink/60">Total Enrolled:</span>
                  <span className="font-bold text-ink">{students.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present:
                  </span>
                  <span className="font-bold text-emerald-700">{presentCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Late:
                  </span>
                  <span className="font-bold text-amber-700">{lateCount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1.5 text-red-700">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Absent:
                  </span>
                  <span className="font-bold text-red-700">{absentCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Roster Table */}
        <div className="lg:col-span-3">
          <Card className="bg-white border-ledger-line shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-parchment">
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Attendance Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-ink/60">
                        No students currently enrolled in this class section.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map(student => {
                      const currentStatus = getStatusForStudent(student.id, student.initialStatus)

                      return (
                        <TableRow key={student.id} className="hover:bg-parchment/40">
                          <TableCell className="font-semibold text-ink">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-ink/60 text-xs font-mono">
                            {student.email}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex items-center rounded-lg border border-ledger-line bg-parchment/60 p-1 gap-1">
                              <button
                                type="button"
                                onClick={() => handleSetStatus(student.id, 'PRESENT')}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                                  currentStatus === 'PRESENT' 
                                    ? 'bg-emerald-600 text-white shadow-xs' 
                                    : 'text-ink/60 hover:text-emerald-700 hover:bg-emerald-50'
                                }`}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStatus(student.id, 'LATE')}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                                  currentStatus === 'LATE' 
                                    ? 'bg-amber-500 text-white shadow-xs' 
                                    : 'text-ink/60 hover:text-amber-700 hover:bg-amber-50'
                                }`}
                              >
                                Late
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSetStatus(student.id, 'ABSENT')}
                                className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                                  currentStatus === 'ABSENT' 
                                    ? 'bg-red-600 text-white shadow-xs' 
                                    : 'text-ink/60 hover:text-red-700 hover:bg-red-50'
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
