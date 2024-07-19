import { useState, useEffect } from 'react'

export function useRainbow() {
    const [color, setColor] = useState<number>(0)

    const rainbowColors: string[] = [
        'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
    ]

    useEffect(() => {
        const interval = setInterval(() => {
            setColor((prevColor) => (prevColor + 1) % rainbowColors.length)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return {
        currentColor: rainbowColors[color],
        rainbowColors,
        backgroundStyle: {
            background: `linear-gradient(45deg, ${rainbowColors.join(', ')})`
        }
    }
}
