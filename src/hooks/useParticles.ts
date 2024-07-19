import { useState, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    color: string;
    radius: number;
    lifetime: number;
    maxLifetime: number;
    velocity: {
        x: number;
        y: number;
    };
}

export function useParticles() {
    const [particles, setParticles] = useState<Particle[]>([]);

    const createParticle = useCallback((x: number, y: number): Particle => {
        const maxLifetime = 1000;
        return {
            x,
            y,
            color: `hsla(${Math.random() * 360}, 100%, 50%, 1)`,
            radius: Math.random() * 5 + 2,
            lifetime: maxLifetime,
            maxLifetime: maxLifetime,
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 3 - 2
            }
        };
    }, []);

    const addParticles = useCallback((x: number, y: number, amount: number = 30) => {
        const newParticles = Array.from({ length: amount }, () => createParticle(x, y));
        setParticles(prevParticles => [...prevParticles, ...newParticles]);
    }, [createParticle]);

    const updateParticles = useCallback(() => {
        setParticles(prevParticles =>
            prevParticles
                .map(p => ({
                    ...p,
                    x: p.x + p.velocity.x,
                    y: p.y + p.velocity.y,
                    lifetime: p.lifetime - 1,
                    velocity: {
                        ...p.velocity,
                        y: p.velocity.y + 0.01
                    }
                }))
                .filter(p => p.lifetime > 0)
        );
    }, []);

    return { particles, addParticles, updateParticles };
}
