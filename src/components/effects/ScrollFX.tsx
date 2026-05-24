'use client';

import { useEffect, useRef, useState } from 'react';

interface ScrollFXProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 3D Tilt Card - 鼠标悬停时卡片跟随倾斜
 */
export function TiltCard({ children, className = '' }: ScrollFXProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    };

    const handleLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`transition-transform duration-200 ease-out ${className}`} style={{ transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
}

/**
 * Parallax Section - 滚动视差效果
 */
export function ParallaxSection({ children, speed = 0.3, className = '' }: ScrollFXProps & { speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollY = (rect.top - window.innerHeight) * speed;
      setOffset(scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div style={{ transform: `translateY(${offset}px)`, transition: 'transform 0.1s linear' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Stagger Reveal - 子元素逐次入场
 */
export function StaggerReveal({ children, className = '', staggerMs = 80 }: ScrollFXProps & { staggerMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? (children as React.ReactNode[]).map((child, i) => (
            <div
              key={i}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * staggerMs}ms`,
              }}
            >
              {child}
            </div>
          ))
        : (
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            {children}
          </div>
        )}
    </div>
  );
}

/**
 * Scale Reveal - 缩放 + 淡入
 */
export function ScaleReveal({ children, className = '' }: ScrollFXProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-800 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.92)',
        filter: visible ? 'blur(0)' : 'blur(4px)',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Counter - 数字滚动效果
 */
export function AnimatedCounter({ end, duration = 1500, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          started.current = true;
          observer.disconnect();

          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/**
 * Glow Trail - 鼠标跟随光晕效果（装饰用）
 */
export function GlowTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);
    window.addEventListener('mousemove', handleMove);
    document.body.addEventListener('mouseenter', handleEnter);
    document.body.addEventListener('mouseleave', handleLeave);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseenter', handleEnter);
      document.body.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s' }}
    >
      <div
        className="absolute h-64 w-64 rounded-full bg-gradient-to-r from-indigo-500/8 to-purple-500/8 blur-3xl"
        style={{
          left: pos.x - 128,
          top: pos.y - 128,
          transition: 'left 0.5s ease-out, top 0.5s ease-out',
        }}
      />
    </div>
  );
}