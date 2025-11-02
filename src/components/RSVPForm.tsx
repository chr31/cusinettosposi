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
  const endpoint = process.env.NEXT_PUBLIC_RSVP_ENDPOINT as string | undefined
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string | undefined

  // Minimal loader for reCAPTCHA v3
  const getRecaptchaToken = async (): Promise<string | null> => {
    if (!recaptchaSiteKey) return null
    const win = window as any
    const loadScript = () => new Promise<void>((resolve, reject) => {
      if (win.grecaptcha) return resolve()
      const s = document.createElement('script')
      s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(recaptchaSiteKey)}`
      s.async = true
      s.defer = true
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Impossibile caricare reCAPTCHA'))
      document.head.appendChild(s)
    })

    await loadScript()
    return new Promise<string>((resolve, reject) => {
      try {
        win.grecaptcha.ready(() => {
          win.grecaptcha
            .execute(recaptchaSiteKey, { action: 'rsvp' })
            .then((token: string) => resolve(token))
            .catch((e: any) => reject(e))
        })
      } catch (e) {
        reject(e)
      }
    })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      if (!endpoint) throw new Error('Endpoint RSVP non configurato')
      const formData = new FormData()
      formData.append('nome', state.nome)
      formData.append('email', state.email)
      formData.append('presenze', String(state.presenze))
      formData.append('messaggio', state.messaggio || '')
      formData.append('userAgent', typeof navigator !== 'undefined' ? navigator.userAgent : '')
      formData.append('timestamp', new Date().toISOString())

      // Optional: add reCAPTCHA v3 token if configured
      try {
        const token = await getRecaptchaToken()
        if (token) formData.append('recaptchaToken', token)
      } catch (e: any) {
        // Non-bloccante: se reCAPTCHA fallisce, prosegui ma segnala nell'errore se la POST fallisce
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || 'Errore durante l\'invio')
      }
      // attempt to parse JSON but don't fail if not JSON
      try { await res.json() } catch {}
      setStatus('ok')
      setState({ nome: '', email: '', presenze: 1, messaggio: '' })
    } catch (err: any) {
      setError(err?.message || 'Qualcosa è andato storto')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {status === 'ok' && (
        <div role="alert" className="rounded-lg border border-green-200 bg-green-50 text-green-800 px-3 py-2 text-sm">
          Grazie! La tua conferma è stata inviata.
        </div>
      )}
      {status === 'error' && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 text-red-800 px-3 py-2 text-sm">
          Errore: {error}
        </div>
      )}
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
      <div className="flex items-center gap-3 flex-wrap">
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
