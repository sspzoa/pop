import { useRef, useEffect } from 'react';
import { useParticles } from './useParticles';

export function useCanvas(width: number, height: number) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { particles, addParticles, updateParticles } = useParticles();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
                const alpha = (p.lifetime / p.maxLifetime) ** 0.5;
                ctx.fillStyle = p.color.replace('1)', `${alpha})`);
                ctx.fill();
            });
            updateParticles();
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [particles, updateParticles]);

    return { canvasRef, addParticles };
}
