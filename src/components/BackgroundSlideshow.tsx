"use client"
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

type ImageSlide = { type: 'image'; src: string }
type VideoSlide = {
  type: 'video'
  src: string
  poster?: string
  // optional fragment loop [start, end)
  start?: number
  end?: number
  muted?: boolean
}

export type Slide = ImageSlide | VideoSlide

type Props = {
  // New flexible API: ordered list of slides (images and/or videos)
  slides?: Slide[]
  // Back-compat: still accept images only
  images?: string[]
  intervalMs?: number
  children?: ReactNode
}

export default function BackgroundSlideshow({ slides, images, intervalMs = 6000, children }: Props) {
  // Normalize props into a single list of slides
  const normalizedSlides: Slide[] = useMemo(() => {
    if (slides && slides.length) return slides
    if (images && images.length) return images.map((src) => ({ type: 'image', src }))
    return []
  }, [slides, images])

  const [index, setIndex] = useState(0)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])

  // Auto-advance
  useEffect(() => {
    if (!normalizedSlides.length) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % normalizedSlides.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [normalizedSlides.length, intervalMs])

  // Play/pause videos depending on active index
  useEffect(() => {
    normalizedSlides.forEach((s, i) => {
      if (s.type !== 'video') return
      const el = videoRefs.current[i]
      if (!el) return
      try {
        if (i === index) {
          // Seek to start of fragment if specified, then play
          if (typeof s.start === 'number') {
            // If near start already, avoid jarring jumps
            if (!el.currentTime || Math.abs(el.currentTime - s.start) > 0.3) {
              el.currentTime = s.start
            }
          }
          void el.play()
        } else {
          el.pause()
        }
      } catch {}
    })
  }, [index, normalizedSlides])

  if (!normalizedSlides.length) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {normalizedSlides.map((slide, i) => {
        const visible = i === index
        const commonClass = 'absolute inset-0 transition-opacity duration-1000'
        const style = { opacity: visible ? 1 : 0 }

        if (slide.type === 'image') {
          return (
            <div
              key={`img-${slide.src}-${i}`}
              className={`${commonClass} bg-center bg-cover`}
              style={{ ...style, backgroundImage: `url(${slide.src})` }}
              aria-hidden={!visible}
            />
          )
        }

        // Video slide
        return (
          <div key={`vid-${slide.src}-${i}`} className={commonClass} style={style} aria-hidden={!visible}>
            <video
              ref={(el) => (videoRefs.current[i] = el)}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted={slide.muted !== false}
              loop={!slide.end && !slide.start}
              poster={slide.poster}
              src={slide.src}
              onLoadedMetadata={(e) => {
                const el = e.currentTarget
                if (typeof slide.start === 'number') {
                  try { el.currentTime = slide.start } catch {}
                }
              }}
              onTimeUpdate={(e) => {
                if (typeof slide.end === 'number') {
                  const el = e.currentTarget
                  if (el.currentTime >= slide.end) {
                    // Loop the fragment
                    el.currentTime = typeof slide.start === 'number' ? slide.start : 0
                  }
                }
              }}
            />
          </div>
        )
      })}
      <div className="absolute inset-0" style={{ background: 'var(--bg-overlay)' }} />
      {children ? (
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-10 px-4">
          <div className="text-center">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  )
}
