'use client';

import { useEffect, useRef, useState } from 'react';

const STATS = [
  { end: 500, suffix: '+', label: 'Cars Exported', icon: '🚗', desc: 'vehicles shipped worldwide' },
  { end: 50,  suffix: '+', label: 'Countries',     icon: '🌍', desc: 'nations we deliver to' },
  { end: 10,  suffix: ' Yrs', label: 'Experience', icon: '🏆', desc: 'in global auto export' },
  { end: 99,  suffix: '%', label: 'Satisfaction',  icon: '⭐', desc: 'rated by our clients' },
];

function useCounter(end: number, duration = 1600, started: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
      else setVal(end);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);
  return val;
}

function StatCard({ stat, index, started }: { stat: typeof STATS[0]; index: number; started: boolean }) {
  const count = useCounter(stat.end, 1800, started);
  return (
    <div
      className="reveal group"
      style={{ transitionDelay: `${index * 0.1}s` }}
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 h-full border border-[var(--border)] bg-white transition-all duration-300 group-hover:border-[var(--accent)] group-hover:shadow-xl"
        style={{ cursor: 'default' }}
      >
        {/* Background number watermark */}
        <div
          className="absolute -right-3 -bottom-3 text-8xl font-black opacity-[0.04] select-none pointer-events-none transition-all duration-300 group-hover:opacity-[0.07]"
          style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}
        >
          {stat.end}{stat.suffix}
        </div>

        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform duration-300 group-hover:scale-110"
          style={{ background: 'var(--accent-light)' }}
        >
          {stat.icon}
        </div>

        {/* Counter */}
        <div className="flex items-end gap-0.5 mb-1">
          <span
            className="text-4xl font-black leading-none tabular-nums"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}
          >
            {count}
          </span>
          <span
            className="text-2xl font-black mb-0.5"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}
          >
            {stat.suffix}
          </span>
        </div>

        <p className="font-bold text-[var(--text)] text-sm mb-0.5">{stat.label}</p>
        <p className="text-xs text-[var(--text-muted)]">{stat.desc}</p>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 h-0.5 rounded-b-2xl transition-all duration-500 group-hover:w-full"
          style={{ width: '0%', background: 'var(--accent)' }}
          ref={(el) => {
            if (el) {
              const parent = el.closest('.group');
              if (parent) {
                parent.addEventListener('mouseenter', () => { el.style.width = '100%'; });
                parent.addEventListener('mouseleave', () => { el.style.width = '0%'; });
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}
