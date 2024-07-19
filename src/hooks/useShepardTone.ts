import { useEffect, useRef, useState } from 'react'

export function useShepardTone() {
    const audioContextRef = useRef<AudioContext | null>(null)
    const [phase, setPhase] = useState(0)

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        return () => {
            audioContextRef.current?.close()
        }
    }, [])

    const createShepardTone = (ctx: AudioContext, startTime: number, duration: number) => {
        const numOctaves = 10
        const fundamental = 16.35

        for (let i = 0; i < numOctaves; i++) {
            const osc = ctx.createOscillator()
            const gainNode = ctx.createGain()
            const filter = ctx.createBiquadFilter()

            osc.type = 'triangle'

            const freq = fundamental * Math.pow(2, i + phase)
            osc.frequency.setValueAtTime(freq, startTime)
            osc.frequency.exponentialRampToValueAtTime(freq * 2, startTime + duration)

            const mid = numOctaves / 2
            const pos = (i + phase) % numOctaves
            const gaussian = Math.exp(-Math.pow(pos - mid, 2) / (2 * Math.pow(mid / 2, 2)))

            gainNode.gain.setValueAtTime(0, startTime)
            gainNode.gain.linearRampToValueAtTime(gaussian * 0.2, startTime + 0.01)
            gainNode.gain.exponentialRampToValueAtTime(gaussian * 0.1, startTime + duration * 0.3)
            gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

            filter.type = 'lowpass'
            filter.frequency.setValueAtTime(2000, startTime)
            filter.Q.setValueAtTime(1, startTime)

            osc.connect(gainNode)
            gainNode.connect(filter)
            filter.connect(ctx.destination)

            osc.start(startTime)
            osc.stop(startTime + duration)
        }
    }

    const playShepardTone = () => {
        if (audioContextRef.current) {
            const ctx = audioContextRef.current
            const now = ctx.currentTime
            const duration = 0.5

            createShepardTone(ctx, now, duration)

            setPhase((prevPhase) => (prevPhase + 0.1) % 1)
        }
    }

    return playShepardTone
}
