'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedHero() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const size = Math.random() * 180 + 40;
      el.className = 'particle';
      el.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 4}s;
        opacity: ${Math.random() * 0.15 + 0.05};
        filter: blur(${Math.random() * 30 + 10}px);
      `;
      container.appendChild(el);
      particles.push(el);
    }

    return () => { particles.forEach((p) => p.remove()); };
  }, []);

  return (
    <section className="relative hero-bg text-white min-h-screen flex items-center overflow-hidden">
      {/* Animated particle layer */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Red accent glow top-right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #dc2626, transparent 70%)' }}
      />
      {/* Red accent glow bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f97316, transparent 70%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40 w-full">
        <div className="max-w-5xl mx-auto text-center">
          {/* Tag line */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/30 bg-red-600/10 text-red-400 text-sm font-semibold tracking-wider uppercase mb-8 animate-fade-down"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Licensed Global Car Export Company
          </div>

          {/* Main headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tight animate-fade-up"
            style={{ animationDelay: '0.15s', opacity: 0, animationFillMode: 'forwards' }}
          >
            Premium Cars.
            <br />
            <span className="gradient-text">Delivered Worldwide.</span>
          </h1>

          {/* Sub headline */}
          <p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}
          >
            VAAM Motors sources, inspects, and exports luxury vehicles to over
            50 countries. Trusted by thousands of happy customers globally.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
            style={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}
          >
            <a
              href="#cars"
              className="btn-glow bg-red-600 hover:bg-red-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl shadow-red-900/50"
            >
              Browse Inventory
            </a>
            <a
              href="/contact"
              className="btn-glow border-2 border-white/20 hover:border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/5 transition-all"
            >
              Request a Car →
            </a>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 mt-14 animate-fade-up"
            style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}
          >
            {[
              { icon: '🛡️', text: 'Licensed Exporter' },
              { icon: '✅', text: 'Certified Inspection' },
              { icon: '🚢', text: 'Door-to-Door Shipping' },
              { icon: '💳', text: 'Secure Payments' },
            ].map((badge) => (
              <div
                key={badge.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/8 text-sm text-gray-300"
              >
                <span>{badge.icon}</span>
                <span className="font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, #080808)' }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-gray-500 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
