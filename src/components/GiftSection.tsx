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
    <div className="rounded-xl border border-white/20 bg-white/70 backdrop-blur p-6">
      <div className="text-lg font-medium text-gray-900">Lista di nozze</div>
      <p className="text-gray-700 mt-2">
        Il nostro regalo più grande è avervi con noi. Se desiderate contribuire al nostro viaggio in Giappone, potete farlo con un bonifico:
      </p>
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <code className="rounded-md bg-gray-900 text-gray-100 px-3 py-2 text-sm">
          {iban}
        </code>
        <button onClick={onCopy} className="rounded-lg bg-gray-900 text-white px-3 py-2 hover:bg-gray-800">
          {copied ? 'Copiato!' : 'Copia IBAN'}
        </button>
      </div>
      {note && <p className="text-gray-600 text-sm mt-3">{note}</p>}
    </div>
  )
}

