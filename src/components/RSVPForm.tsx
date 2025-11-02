"use client"
import { useState } from 'react'

type FormState = {
  nome: string
  email: string
  presenze: number
  messaggio?: string
}

export default function RSVPForm() {
  const [state, setState] = useState<FormState>({ nome: '', email: '', presenze: 1, messaggio: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state),
      })
      if (!res.ok) throw new Error('Errore durante l\'invio')
      setStatus('ok')
      setState({ nome: '', email: '', presenze: 1, messaggio: '' })
    } catch (err: any) {
      setError(err?.message || 'Qualcosa è andato storto')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-800">Nome e cognome</label>
        <input
          required
          value={state.nome}
          onChange={(e) => setState((s) => ({ ...s, nome: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          placeholder="Es. Mario Rossi"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800">Email</label>
          <input
            required
            type="email"
            value={state.email}
            onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
            placeholder="nome@esempio.it"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800">Numero di presenze</label>
          <input
            required
            type="number"
            min={1}
            value={state.presenze}
            onChange={(e) => setState((s) => ({ ...s, presenze: Number(e.target.value) }))}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-800">Messaggio (opzionale)</label>
        <textarea
          value={state.messaggio}
          onChange={(e) => setState((s) => ({ ...s, messaggio: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-700"
          rows={3}
          placeholder="Allergie, intolleranze, note..."
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-lg bg-gray-900 text-white px-4 py-2 hover:bg-gray-800 disabled:opacity-60"
        >
          {status === 'sending' ? 'Invio...' : 'Conferma presenza'}
        </button>
        {status === 'ok' && <span className="text-green-700">Grazie! Ricevuto.</span>}
        {status === 'error' && <span className="text-red-700">{error}</span>}
      </div>
    </form>
  )
}

