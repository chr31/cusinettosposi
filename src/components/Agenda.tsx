export type AgendaItem = {
  time: string
  title: string
  location: string
  mapsUrl: string
  description?: string
}

export default function Agenda({ items }: { items: AgendaItem[] }) {
  return (
    <div className={`font-sans grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6`}>
      {items.map((it, idx) => (
        <div
          key={idx}
          className="relative rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-6 shadow-sm"
        >
          <div className="flex items-start gap-4 md:gap-5">
            <div className="text-2xl font-semibold text-gray-800 tabular-nums w-16 md:w-24 shrink-0">
              {it.time}
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900 leading-tight">{it.title}</div>
              <div className="mt-1 text-emerald-800 text-base flex items-center gap-3 flex-wrap">
                <a
                  href={it.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-2 hover:text-emerald-900"
                  aria-label={`Apri in Google Maps: ${it.location}`}
                >
                  {it.location}
                </a>
                <a
                  href={it.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-gray-300 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-50"
                >
                  Apri in Maps
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
