"use client"
import { useEffect, useState, type ReactNode } from 'react'

type Props = {
  images: string[]
  intervalMs?: number
  children?: ReactNode
}

export default function BackgroundSlideshow({ images, intervalMs = 6000, children }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!images.length) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [images, intervalMs])

  if (!images.length) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}
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
