"use client"
import { useState } from 'react'

export default function GiftSection({ iban, note }: { iban: string; note?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(iban)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm text-center">
      <div className="text-lg font-medium text-gray-900">Viaggio alle Canarie</div>
      <p className="text-gray-700 mt-2">
        Se desideraste farci un regalo, ci farebbe piacere un contributo per la nostra luna di miele alle isole Canarie.
      </p>
      <div className="mt-4">
        <div className="relative w-full max-w-xl rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900/90 px-4 py-4 text-base mx-auto pr-12">
          <code className="block w-full text-center font-mono">{iban}</code>
          <button
            onClick={onCopy}
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            aria-label={copied ? 'IBAN copiato' : 'Copia IBAN'}
            title={copied ? 'Copiato!' : 'Copia'}
          >
            {copied ? (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 5.5l-7 7-3-3" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="9" y="9" width="11" height="11" rx="2" strokeWidth="1.8" />
                <path d="M7 15H6a2 2 0 01-2-2V6a2 2 0 012-2h7a2 2 0 012 2v1" strokeWidth="1.8" />
              </svg>
            )}
            <span className="sr-only">{copied ? 'IBAN copiato' : 'Copia IBAN'}</span>
          </button>
        </div>
      </div>
      {note && <p className="text-gray-600 text-sm mt-3">{note}</p>}
    </div>
  )
}
