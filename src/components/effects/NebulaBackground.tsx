'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  opacityDir: number;
}

export default function NebulaBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const colors = [
      'rgba(99, 102, 241, ',
      'rgba(139, 92, 246, ',
      'rgba(59, 130, 246, ',
      'rgba(16, 185, 129, ',
      'rgba(236, 72, 153, ',
    ];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      initParticles();
    }

    function initParticles() {
      const count = Math.min(Math.floor((canvas!.width * canvas!.height) / 8000), 150);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.1,
          opacityDir: Math.random() > 0.5 ? 0.003 : -0.003,
        });
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p, i) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = canvas!.width + 10;
        if (p.x > canvas!.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas!.height + 10;
        if (p.y > canvas!.height + 10) p.y = -10;

        // Pulse opacity
        p.opacity += p.opacityDir;
        if (p.opacity > 0.7 || p.opacity < 0.05) p.opacityDir *= -1;

        // Draw particle
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color + p.opacity + ')';
        ctx!.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            const lineOpacity = (1 - dist / 150) * 0.15;
            ctx!.strokeStyle = p.color + lineOpacity + ')';
            ctx!.lineWidth = 0.5;
            ctx!.stroke();
          }
        }

        // Mouse interaction
        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 200) {
          const force = (200 - mdist) / 200;
          p.vx -= (mdx / mdist) * force * 0.02;
          p.vy -= (mdy / mdist) * force * 0.02;
        }
      });

      animId = requestAnimationFrame(animate);
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }

    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)' }}
    />
  );
}