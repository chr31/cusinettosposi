"use client"
import { useEffect } from 'react'
import type { ReactNode } from 'react'

type SlideOverProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', onKey)
      // prevent background scroll
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', onKey)
        document.body.style.overflow = prev
      }
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] md:w-[520px] bg-white shadow-xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dettagli'}
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Chiudi pannello"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l8 8M14 6l-8 8" />
            </svg>
          </button>
        </div>
        <div className="h-[calc(100%-57px)] overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

