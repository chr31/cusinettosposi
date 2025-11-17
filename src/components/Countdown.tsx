"use client"
import { useEffect, useState } from 'react'

type Remaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Countdown({ target, digitsClassName }: { target: string; digitsClassName?: string }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null)

  useEffect(() => {
    const targetDate = new Date(target)
    const tick = () => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) {
        setRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      setRemaining({ days, hours, minutes, seconds })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  if (!remaining) return null

  const Item = ({ label, value }: { label: string; value: number }) => (
    <div className="flex flex-col items-center px-2 sm:px-4 py-1.5 sm:py-2">
      <div className={`text-3xl sm:text-5xl md:text-6xl font-semibold text-white tabular-nums ${digitsClassName || ''}`}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-white/90 text-sm uppercase tracking-wide">{label}</div>
    </div>
  )

  return (
    <div className="font-amoresa flex items-center justify-center gap-1.5 sm:gap-4 bg-black/30 rounded-lg sm:rounded-xl p-2.5 sm:p-4 backdrop-blur">
      <Item label="Giorni" value={remaining.days} />
      <span className="text-white/60">:</span>
      <Item label="Ore" value={remaining.hours} />
      <span className="text-white/60">:</span>
      <Item label="Min" value={remaining.minutes} />
      <span className="text-white/60">:</span>
      <Item label="Sec" value={remaining.seconds} />
    </div>
  )
}
