'use client'

import { Printer } from 'lucide-react'

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 border border-ledger-line rounded-md text-sm font-medium text-ink hover:bg-parchment hover:text-primary-red transition-colors print:hidden"
    >
      <Printer className="w-4 h-4" />
      Print Record
    </button>
  )
}
