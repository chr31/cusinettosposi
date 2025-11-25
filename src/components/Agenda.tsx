export type AgendaItem = {
  time: string
  title: string
  location: string
  mapsUrl: string
  description?: string
}

import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  weight: '700',
})

export default function Agenda({ items }: { items: AgendaItem[] }) {
  return (
    <div className={`font-sans grid grid-cols-1 gap-4 md:gap-6`}>
      {items.map((it, idx) => (
        <div
          key={idx}
          className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm"
        >
          <div className="flex items-start gap-4 md:gap-5">
            <div className={`${dancingScript.className} text-2xl font-semibold text-gray-800 tabular-nums w-16 md:w-24 shrink-0`}>
              {it.time}
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-gray-900 leading-tight"><i>{it.title}</i></div>
              <div className="mt-1 text-emerald-800 text-base flex items-center gap-3 flex-wrap">
                <a
                  href={it.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline underline-offset-2 hover:text-emerald-900"
                  aria-label={`Apri in Google Maps: ${it.location}`}
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 text-emerald-700/60"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 18.5s6-5.2 6-9.5a6 6 0 10-12 0c0 4.3 6 9.5 6 9.5z" />
                    <circle cx="10" cy="9" r="2.25" strokeWidth="1.5" />
                  </svg>
                  {it.location}
                </a>
              </div>
              {it.description ? (
                <div className="text-gray-700 text-base mt-2">{it.description}</div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
