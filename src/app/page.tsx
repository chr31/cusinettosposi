import BackgroundSlideshow from '@/components/BackgroundSlideshow'
import Countdown from '@/components/Countdown'
import Agenda, { type AgendaItem } from '@/components/Agenda'
import RSVPForm from '@/components/RSVPForm'
import GiftSection from '@/components/GiftSection'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] })

const WEDDING_DATE = process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-05-30T11:00:00+02:00'
const IBAN = process.env.NEXT_PUBLIC_IBAN || 'IT00 X000 0000 0000 0000 0000 000'
const COUPLE = process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Sara & Christian'

const IMAGES = [
  'photos/main1.png',
  'photos/main2.png',
]

const AGENDA: AgendaItem[] = [
  {
    time: '11:00',
    title: 'Cerimonia',
    location: 'Parrocchia di Santa Margherita',
    mapsUrl: 'https://maps.app.goo.gl/M2ndycwgFXTkKhXNA',
    description: 'Dove avviene la magia!',
  },
  {
    time: '13:00',
    title: 'Aperitivo',
    location: 'Villa Revedin, Gorgo al Monticano',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Brindisi e stuzzichini in giardino',
  },
  {
    time: '14:00',
    title: 'Pranzo',
    location: 'Villa Revedin – Sala principale',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Menu delizioso e brindisi con gli sposi',
  },
  {
    time: '17:00',
    title: 'Taglio torta',
    location: 'Villa Revedin – Giardino',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Momento dolce e foto di gruppo',
  },
  {
    time: '18:00',
    title: 'Festa',
    location: 'Villa Revedin – Area party',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Musica, balli e tanto divertimento',
  },
]

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Hero */}
      <section id="hero" className="relative min-h-[90vh] flex items-center">
        <BackgroundSlideshow images={IMAGES} intervalMs={6000}>
          <h1 className={`font-amoresa text-4xl sm:text-6xl font-semibold drop-shadow-md text-white`}>{COUPLE}</h1>
          <div className="mt-2 text-white/90 text-sm sm:text-base">30 Maggio 2026</div>
          <div className="mt-4">
            <Countdown target={WEDDING_DATE} digitsClassName={inter.className} />
          </div>
        </BackgroundSlideshow>
        
      </section>

      {/* Agenda */}
      <section id="agenda" className="relative py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Agenda della giornata</h2>
          <p className="text-gray-600 mt-1">Orari indicativi, potrebbero subire variazioni leggere.</p>
          <div className="mt-6">
            <Agenda items={AGENDA} />
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="relative py-12 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Conferma di partecipazione</h2>
          <p className="text-gray-600 mt-1">Compila il modulo per farci sapere che verrai.</p>
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <RSVPForm />
          </div>
        </div>
      </section>

      {/* Lista nozze */}
      <section id="lista" className="relative py-12 sm:py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">Lista di nozze</h2>
          <p className="text-gray-600 mt-1">Contributo per il viaggio in Giappone.</p>
          <div className="mt-6">
            <GiftSection iban={IBAN} note="Causale suggerita: 'Viaggio Cristian & Federica'" />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {COUPLE}
      </footer>
    </main>
  )
}
