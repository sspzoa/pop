'use client'

import React, { useCallback } from 'react'
import { useStore } from '@/store/counterStore'
import { useShepardTone } from '@/hooks/useShepardTone'
import { useRainbow } from '@/hooks/useRainbow'
import { useCanvas } from '@/hooks/useCanvas'
import { useWindowSize } from '@/hooks/useWindowSize'

export default function Counter() {
    const { count, inc } = useStore()
    const playShepardTone = useShepardTone()
    const { currentColor, backgroundStyle } = useRainbow()
    const { width, height } = useWindowSize()
    const { canvasRef, addParticles } = useCanvas(width, height)

    const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        inc()
        playShepardTone()

        const canvas = canvasRef.current
        if (canvas) {
            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            addParticles(x, y)
        }
    }, [inc, playShepardTone, addParticles, canvasRef])

    return (
        <div className="flex flex-col justify-center items-center h-screen gap-20 relative overflow-hidden" style={backgroundStyle}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                width={width}
                height={height}
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
