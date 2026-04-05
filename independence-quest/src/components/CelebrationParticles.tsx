import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; color: string; size: number; speedX: number; speedY: number; rotation: number; vx: number; vy: number };

export function CelebrationParticles({ intensity = 'medium' }: { intensity?: 'small' | 'medium' | 'large' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const particleCount = intensity === 'small' ? 100 : intensity === 'medium' ? 200 : 400;
    const colors = ['#fbbf24', '#34d399', '#60a5fa', '#c084fc', '#f87171', '#22c55e'];
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: rect.width / 2,
        y: rect.height / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        rotation: Math.random() * 360,
        vx: 0,
        vy: 0
      });
    }

    const gravity = 0.1;
    const friction = 0.98;
    let animationFrame: number;

    function update() {
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (const p of particles) {
        p.vy += gravity;
        p.vx += (p.speedX - p.vx) * 0.1;
        p.vy += (p.speedY - p.vy) * 0.1;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += 2;
        p.vx *= friction;
        p.vy *= friction;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      animationFrame = requestAnimationFrame(update);
    }
    update();

    return () => cancelAnimationFrame(animationFrame);
  }, [intensity]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }} />;
}
