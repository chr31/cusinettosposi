"use client"

import { useEffect, useState } from 'react'
import BackgroundSlideshow, { type Slide } from '@/components/BackgroundSlideshow'
import Countdown from '@/components/Countdown'
// Tipi non necessari qui per evitare import di tipo da componenti
import Agenda from '@/components/Agenda'
import RSVPForm from '@/components/RSVPForm'
import GiftSection from '@/components/GiftSection'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] })

const WEDDING_DATE = process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-05-30T11:00:00+02:00'
const IBAN = process.env.NEXT_PUBLIC_IBAN || 'IT00 X000 0000 0000 0000 0000 000'
const COUPLE = process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Sara & Christian'
const MAIN_STORY_VIDEO_SRC = 'photos/main4.mp4'

const SLIDES: Slide[] = [
  { type: 'image', src: 'photos/main1.png' },
  { type: 'video', src: 'photos/main3.mp4', poster: 'photos/main1.png', start: 0, end: 7, muted: true },
  { type: 'image', src: 'photos/main2.png' },
  { type: 'video', src: MAIN_STORY_VIDEO_SRC, poster: 'photos/main1.png', start: 0, end: 7, muted: true },
  { type: 'video', src: 'photos/main5.mp4', poster: 'photos/main1.png', start: 0, end: 7, muted: true },
]

const AGENDA = [
  {
    time: '11:00',
    title: 'Cerimonia',
    location: 'Parrocchia di Santa Margherita',
    mapsUrl: 'https://maps.app.goo.gl/M2ndycwgFXTkKhXNA',
    description: 'Qui avviene la magia!',
  },
  {
    time: '13:00',
    title: 'Aperitivo e Buffet',
    location: 'Villa Revedin, Gorgo al Monticano',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Abbuffata immersi nel verde.',
  },
  {
    time: '14:00',
    title: 'Pranzo',
    location: 'Villa Revedin – Sala principale',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Menu delizioso e brindisi con gli sposi(noi).',
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

export default function Page() {
  const [visibleStepCount, setVisibleStepCount] = useState(0)
  const [slideshowIndex, setSlideshowIndex] = useState<number | undefined>(undefined)
  const [welcomeHidden, setWelcomeHidden] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWelcomeHidden(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const y = (window.scrollY || window.pageYOffset) + rect.top
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const steps = [
    {
      id: 'agenda',
      sectionId: 'agenda-end',
      card: (
        <>
          <h2 className="text-2xl sm:text-5xl font-semibold text-gray-900 text-center">Ci sposiamo!</h2>
          <p className="font-amoresa text-lg sm:text-2xl text-gray-900 mt-1 text-center"><i>Il 30 Maggio vi vorremmo vicini per festeggiare il nostro grande giorno.</i></p>
          <div className="mt-6">
            <Agenda items={AGENDA} />
          </div>
        </>
      ),
      ctaLabel: 'Ma come ci siamo arrivati?',
      ctaAria: 'Ma come ci siamo arrivati?',
      ctaTitle: 'Ma come ci siamo arrivati?',
    },
    {
      id: 'pinguini',
      sectionId: 'pinguini-end',
      card: (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Pinguini</h2>
          <p className="text-gray-700 mt-3 text-center">
            Si dice che i pinguini quando trovano la compagna della loro vita si regalino dei sassolini.
          </p>
        </>
      ),
      ctaLabel: 'Quindi? Ci sarai?',
      ctaAria: 'Quindi? Ci sarai?',
      ctaTitle: 'Quindi? Ci sarai?',
      sectionClassName: 'min-h-[100svh]',
    },
    {
      id: 'rsvp',
      sectionId: 'rsvp-end',
      card: (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Partecipazioni</h2>
          <p className="text-gray-600 mt-1 text-center">
            Facci sapere qui sotto se verrai, oppure scrivici su whatsapp.<br />
            Ricorda che sappiamo dove abiti 😎
          </p>
          <div className="mt-6">
            <RSVPForm />
          </div>
        </>
      ),
      ctaLabel: 'Titoli di coda',
      ctaAria: 'Titoli di coda',
      ctaTitle: 'Titoli di coda',
    },
    {
      id: 'lista',
      sectionId: 'lista-end',
      card: (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Lista nozze</h2>
          <div className="mt-6">
            <GiftSection iban={IBAN} note="" />
          </div>
        </>
      ),
    },
  ]

  const showStep = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= steps.length) return
    const sectionId = steps[targetIndex].sectionId
    if (visibleStepCount <= targetIndex) {
      setVisibleStepCount(targetIndex + 1)
      setTimeout(() => scrollToElement(sectionId), 0)
    } else {
      scrollToElement(sectionId)
    }
  }

  const scrollToContent = () => {
    showStep(0)
  }
  return (
    <main className="relative min-h-screen">
      {/* Schermata di benvenuto iniziale */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center welcome-overlay-bg transition-opacity duration-700 ${
          welcomeHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <h2 className="welcome-fade welcome-title font-semibold text-green-700 text-center px-6">
          Benvenuti!!
        </h2>
      </div>

      {/* Slideshow fisso come sottofondo; il timer parte dopo la schermata di benvenuto */}
      <BackgroundSlideshow
        slides={SLIDES}
        intervalMs={6000}
        fixed
        activeIndex={slideshowIndex}
        paused={!welcomeHidden}
      />

      {/* Countdown che scorre con la pagina, inizialmente visibile in basso nell'hero */}

      {/* Hero sovrapposto al background */}
      <section id="hero" className="relative min-h-[100svh] text-center">
        {/* Titolo subito sopra il countdown, entrambi in basso alla sezione */}
        <div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center justify-end px-4"
          style={{ paddingBottom: 'calc(var(--menu-height, 56px) + env(safe-area-inset-bottom, 0px) + 12px)' }}
        >
          <h1 className="font-amoresa text-4xl sm:text-6xl font-semibold drop-shadow-md text-white"><i>{COUPLE}</i></h1>
          <div className="mt-2">
            <Countdown target={WEDDING_DATE} digitsClassName={inter.className} />
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={scrollToContent}
              className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-gray-900 px-5 py-2 shadow-sm border border-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60"
              aria-label="Che succede? Vai alle sezioni"
              title="Che succede?"
            >
              Che succede?
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l5 5 5-5" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Ancora per lo scroll dal pulsante dell'hero */}
      <div id="content-start" />

      {/* Sezioni in sequenza, guidate dall'array steps */}
      {steps.map((step, index) => {
        if (index >= visibleStepCount) return null
        return (
          <section
            key={step.id}
            id={step.sectionId}
            className={`relative py-8 sm:py-16 bg-transparent ${step.sectionClassName ?? ''}`}
          >
            <div className="max-w-5xl mx-auto px-4">
              <div className="mt-0 max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
                {step.card}
              </div>
              {step.ctaLabel && index < steps.length - 1 && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (step.id === 'agenda') {
                        // Porta lo slideshow alla slide con indice 2,
                        // poi prosegue normalmente con le slide successive
                        setSlideshowIndex(2)
                        try {
                          const el = document.querySelector(
                            `video[data-slide-src="${MAIN_STORY_VIDEO_SRC}"]`,
                          ) as HTMLVideoElement | null
                          if (el) {
                            el.currentTime = 0
                            void el.play()
                          }
                        } catch {}
                      }
                      showStep(index + 1)
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-gray-900 px-5 py-2 shadow-sm border border-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60"
                    aria-label={step.ctaAria}
                    title={step.ctaTitle}
                  >
                    {step.ctaLabel}
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l5 5 5-5" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </section>
        )
      })}

    </main>
  )
}
