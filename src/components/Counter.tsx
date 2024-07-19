'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useStore } from '@/store/counterStore'
import { useShepardTone } from '@/hooks/useShepardTone'
import { useRainbow } from '@/hooks/useRainbow'
import { useParticles } from '@/hooks/useParticles'

export default function Counter() {
    const { count, inc } = useStore()
    const playShepardTone = useShepardTone()
    const { currentColor, backgroundStyle } = useRainbow()
    const { particles, addParticles, updateParticles } = useParticles()
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateCanvasSize = () => {
            setCanvasSize({ width: window.innerWidth, height: window.innerHeight })
        }

        updateCanvasSize()
        window.addEventListener('resize', updateCanvasSize)

        return () => window.removeEventListener('resize', updateCanvasSize)
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            particles.forEach((p) => {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI)
                const alpha = (p.lifetime / p.maxLifetime) ** 0.5
                ctx.fillStyle = p.color.replace('1)', `${alpha})`)
                ctx.fill()
            })
            updateParticles()
            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [particles, updateParticles])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        inc()
        playShepardTone()

        const canvas = canvasRef.current
        if (canvas) {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            addParticles(x, y)
        }
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-20 relative overflow-hidden" style={backgroundStyle}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                width={canvasSize.width}
                height={canvasSize.height}
                style={{ zIndex: 10 }}
            />
            <h1 className="text-8xl font-bold relative z-20" style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>{count}</h1>
            <button
                className="p-10 border rounded text-4xl transition-colors duration-300 ease-in-out relative z-20"
                onClick={handleClick}
                style={{backgroundColor: currentColor, color: 'white', borderColor: 'white'}}
            >
                Click!
            </button>
        </div>
    )
}
