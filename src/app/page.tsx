"use client"

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import BackgroundSlideshow, { type Slide } from '@/components/BackgroundSlideshow'
import Countdown from '@/components/Countdown'
// Tipi non necessari qui per evitare import di tipo da componenti
import Agenda from '@/components/Agenda'
import RSVPForm from '@/components/RSVPForm'
import GiftSection from '@/components/GiftSection'
import { Inter, Dancing_Script } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700'] })
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: '400' })

const WEDDING_DATE = process.env.NEXT_PUBLIC_WEDDING_DATE || '2026-05-30T11:00:00+02:00'
const IBAN = process.env.NEXT_PUBLIC_IBAN || 'IT00 X000 0000 0000 0000 0000 000'
const COUPLE = process.env.NEXT_PUBLIC_COUPLE_NAMES || 'Sara & Christian'
const MAIN_STORY_VIDEO_SRC = 'photos/main4.mp4'

// Slide di default (hero)
const HERO_SLIDES: Slide[] = [
  { type: 'image', src: 'photos/main1.png' },
  { type: 'video', src: 'photos/ballo.mp4', poster: 'photos/main1.png', start: 0, end: 7, muted: true },
  { type: 'image', src: 'photos/main2.png' },
  { type: 'video', src: "photos/canto.mp4", poster: 'photos/main1.png', start: 0, end: 7, muted: true },
]

// Esempio: slide specifiche per alcune sezioni
const AGENDA_SLIDES: Slide[] = HERO_SLIDES

const STORIA_SLIDES: Slide[] = [
  { type: 'image', src: 'photos/tutti.jpg' },
  { type: 'image', src: 'photos/marcellubiana.jpg' },
  { type: 'image', src: 'photos/GB.jpg' },
  { type: 'image', src: 'photos/GN.jpg' },
]

const PINGUINI_SLIDES: Slide[] = [
  { type: 'image', src: 'photos/main2.png' },
  { type: 'video', src: "photos/sasso.mp4", poster: 'photos/main1.png', start: 0, end: 7, muted: true },
]

// Slide per le altre sezioni
const TIRIAMO_LE_SOMME_SLIDES: Slide[] = [
  { type: 'image', src: 'photos/amici1.jpeg' },
  { type: 'image', src: 'photos/amici2.jpeg' },
  { type: 'image', src: 'photos/amici3.jpeg' },
  { type: 'image', src: 'photos/amici4.jpeg' },
]
const RSVP_SLIDES: Slide[] = HERO_SLIDES
const LISTA_SLIDES: Slide[] = HERO_SLIDES

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
    description: 'Iniziano i festeggiamenti!',
  },
  {
    time: '14:00',
    title: 'Pranzo',
    location: 'Villa Revedin – Sala principale',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Se magna!',
  },
  {
    time: '17:00',
    title: 'Taglio torta',
    location: 'Villa Revedin – Giardino',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Torta, foto e brindisi con gli sposi(noi).',
  },
  {
    time: '18:00',
    title: 'Festa',
    location: 'Villa Revedin – Area party',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Villa+Revedin%2C+Gorgo+al+Monticano',
    description: 'Se beve, se canta, se baea!!',
  },
]

function PageContent() {
  const searchParams = useSearchParams()
  const isInviteView = searchParams.get('invito') === '1'

  const [visibleStepCount, setVisibleStepCount] = useState(0)
  const [slideshowIndex, setSlideshowIndex] = useState<number | undefined>(undefined)
  const [welcomeHidden, setWelcomeHidden] = useState(false)
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null)

  const agendaItems = isInviteView ? AGENDA : [AGENDA[0]]

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

  const allSteps = [
    {
      id: 'agenda',
      sectionId: 'agenda-end',
      slides: AGENDA_SLIDES,
      card: (
        <>
          <h2 className="text-2xl sm:text-5xl font-semibold text-gray-900 text-center">Ci sposiamo!</h2>
          <p className="font-amoresa text-lg sm:text-2xl text-gray-900 mt-1 text-center"><i>Il 30 Maggio vi vorremmo vicini per festeggiare il nostro grande giorno.</i></p>
          <div className="mt-6">
            <Agenda items={agendaItems} />
          </div>
        </>
      ),
      ctaLabel: 'Ma come ci siamo arrivati?',
      ctaAria: 'Ma come ci siamo arrivati?',
      ctaTitle: 'Ma come ci siamo arrivati?',
    },
    {
      id: 'storia',
      sectionId: 'storia-end',
      slides: STORIA_SLIDES,
      wrapCard: false,
      sectionClassName: 'min-h-[100svh] py-0 sm:py-0',
      card: (
        <div className="flex flex-col justify-between min-h-[90svh]">
          <div className="-mt-4 sm:-mt-10 max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">La nostra storia</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 bg-white/70 p-4 sm:p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 text-center sm:text-left">Gli incontri improbabili..</h3>
                <p className="text-gray-700 mt-2 text-sm sm:text-base text-center sm:text-left">
                Due gruppi di amici, un bar frequentato raramente, il compleanno di una ragazza del gruppo e ah, aspetta! "Vecchio lei la conosco!!"
                {/* Lei studia infermieristica a Trieste, lui fa cose al computer verso Roncade */}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-white/70 p-4 sm:p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 text-center sm:text-left">..le storie che sorprendono</h3>
                <p className="text-gray-700 mt-2 text-sm sm:text-base text-center sm:text-left">
                  Grigliate, viaggi in auto, passeggiate in montagna, mare, canzoni, grigliate, bisticci, snowboard, serate mimi e ancora grigliateee!!
                </p>
              </div>
            </div>
          </div>
          <div className="max-w-xl mx-auto mb-[20px] sm:mb-[20px]">
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">E quindi</h2>
              <p className="text-gray-700 mt-3 text-center">
                Eccoci: pronti a dirci sì, con il cuore pieno di gratitudine per tutte le persone che hanno fatto parte del nostro viaggio e che anche oggi continuano a essere presenze costanti nelle nostre vite.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const targetIndex = steps.findIndex((s) => s.id === 'tiriamo-le-somme')
                  showStep(targetIndex === -1 ? 0 : targetIndex)
                }}
                className="inline-flex items-center gap-2 rounded-full bg-white/90 hover:bg-white text-gray-900 px-5 py-2 shadow-sm border border-white/70 backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/60"
                aria-label="Tiriamo le somme"
                title="Tiriamo le somme"
              >
                Tiriamo le somme
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8l5 5 5-5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ),
      ctaLabel: '',
      ctaAria: 'Tiriamo le somme',
      ctaTitle: 'Tiriamo le somme',
    },
    {
      id: 'tiriamo-le-somme',
      sectionId: 'tiriamo-le-somme-end',
      slides: TIRIAMO_LE_SOMME_SLIDES,
      card: (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Tiriamo le somme</h2>
          <div className="mt-3 grid max-w-2xl mx-auto grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-3 sm:p-4 text-center shadow-sm">
              <div className="text-xl sm:text-2xl font-semibold text-green-700">280.000 KM</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1 uppercase tracking-wide">in auto</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-3 sm:p-4 text-center shadow-sm">
              <div className="text-xl sm:text-2xl font-semibold text-green-700">13.000 KM</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1 uppercase tracking-wide">di passeggiate</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-3 sm:p-4 text-center shadow-sm">
              <div className="text-xl sm:text-2xl font-semibold text-green-700">1.286 ORE</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1 uppercase tracking-wide">di canzoni cantate</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-3 sm:p-4 text-center shadow-sm">
              <div className="text-lg sm:text-xl font-semibold text-green-700">QUELLI BELLI</div>
              <div className="text-xs sm:text-sm text-gray-700 mt-1 uppercase tracking-wide">amici</div>
            </div>
          </div>
        </>
      ),
      ctaLabel: 'E poi una scelta..\n Ma perchè?',
      ctaAria: 'E poi una scelta..\n Ma perchè?',
      ctaTitle: 'E poi una scelta..\n Ma perchè?',
      sectionClassName: 'min-h-[100svh] pt-[20px] sm:pt-[20px] pb-32 sm:pb-24',
    },
    {
      id: 'pinguini',
      sectionId: 'pinguini-end',
      slides: PINGUINI_SLIDES,
      card: (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Pinguini</h2>
          <p className="text-gray-700 mt-3 text-center">
            Si dice che i pinguini quando incontrano la compagna della vita le regalino dei sassolini.
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
      slides: RSVP_SLIDES,
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
      sectionClassName: 'min-h-[100svh] flex items-center py-0 sm:py-0',
    },
    {
      id: 'lista',
      sectionId: 'lista-end',
      slides: LISTA_SLIDES,
      card: (
        <>
          <div className="mt-0 max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Il saggio dice</h2>
            <p className="text-gray-700 mt-3 text-center">
              I ricordi più belli non si comprano, si vivono. Se vorrai farne parte, ogni gesto,
              piccolo o grande, sarà per noi un pezzo di viaggio in più da condividere.
            </p>
          </div>
          <div className="mt-8 max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">Lista nozze</h2>
            <div className="mt-6">
              <GiftSection iban={IBAN} note="" />
            </div>
          </div>
        </>
      ),
      wrapCard: false,
      sectionClassName: 'min-h-[100svh] flex items-center py-0 sm:py-0',
    },
  ]

  const steps = isInviteView ? allSteps : allSteps.filter((s) => s.id !== 'rsvp')

  // Precaricamento progressivo delle slide:
  // - usa il tempo della schermata di benvenuto
  // - procede sezione per sezione (hero -> step 0 -> step 1 -> ...)
  //   e se la sezione +1 finisce in anticipo passa alla successiva.
  const preloadedSrcsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (typeof window === 'undefined') return

    const slideGroups: Slide[][] = [HERO_SLIDES, ...steps.map((s) => s.slides ?? [])]

    const preloadImage = (src: string) =>
      new Promise<void>((resolve) => {
        if (!src) {
          resolve()
          return
        }
        if (preloadedSrcsRef.current.has(src)) {
          resolve()
          return
        }
        const img = new Image()
        img.onload = img.onerror = () => {
          preloadedSrcsRef.current.add(src)
          resolve()
        }
        img.src = src
      })

    const preloadVideo = (src: string) =>
      new Promise<void>((resolve) => {
        if (!src) {
          resolve()
          return
        }
        if (preloadedSrcsRef.current.has(src)) {
          resolve()
          return
        }
        const video = document.createElement('video')
        const done = () => {
          preloadedSrcsRef.current.add(src)
          video.onloadeddata = null
          video.onerror = null
          resolve()
        }
        video.preload = 'auto'
        video.onloadeddata = done
        video.onerror = done
        video.src = src
        try {
          video.load()
        } catch {
          done()
        }
      })

    const preloadSlides = async (slides: Slide[]) => {
      await Promise.all(
        slides.map((s) => {
          if (s.type === 'image') return preloadImage(s.src)
          return preloadVideo(s.src)
        }),
      )
    }

    let cancelled = false

    const run = async () => {
      for (const group of slideGroups) {
        if (cancelled) break
        if (!group || !group.length) continue
        // Precarica ogni gruppo in sequenza; quando il gruppo (es. sezione+1)
        // ha finito, si passa automaticamente a quello successivo.
        await preloadSlides(group)
      }
    }

    void run()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showStep = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= steps.length) return
    const sectionId = steps[targetIndex].sectionId
    if (visibleStepCount <= targetIndex) {
      setVisibleStepCount(targetIndex + 1)
      setTimeout(() => scrollToElement(sectionId), 0)
    } else {
      scrollToElement(sectionId)
    }
    setActiveStepIndex(targetIndex)
  }

  const scrollToContent = () => {
    showStep(0)
  }

  const currentSlides = activeStepIndex == null ? HERO_SLIDES : steps[activeStepIndex]?.slides ?? HERO_SLIDES

  return (
    <main className="relative min-h-screen">
      {/* Schermata di benvenuto iniziale */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center welcome-overlay-bg transition-opacity duration-700 ${
          welcomeHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <h2 className={`${dancingScript.className} welcome-fade welcome-title font-semibold text-green-700 text-center px-6`}>
          Benvenuti!!
        </h2>
      </div>

      {/* Slideshow fisso come sottofondo; il timer parte dopo la schermata di benvenuto */}
      <BackgroundSlideshow
        slides={currentSlides}
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
        className={
          step.id === 'agenda'
            ? 'relative bg-transparent min-h-[100svh] pt-[20px] sm:pt-[20px] pb-[80px] sm:pb-[80px]'
            : `relative py-8 sm:py-16 bg-transparent ${step.sectionClassName ?? ''}`
        }
      >
        <div className="max-w-5xl mx-auto px-4">
          {step.wrapCard === false ? (
            step.card
          ) : (
            <div className="mt-0 max-w-xl mx-auto rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 sm:p-6 shadow-sm">
              {step.card}
            </div>
          )}
              {step.ctaLabel && index < steps.length - 1 && (
                <div
                  className={
                    step.id === 'agenda' || step.id === 'tiriamo-le-somme' || step.id === 'pinguini'
                      ? 'absolute inset-x-0 bottom-[20px] flex justify-center'
                      : 'mt-8 flex justify-center'
                  }
                >
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

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  )
}
