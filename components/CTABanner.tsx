'use client';

import { useEffect, useRef, useState } from 'react';

const MARQUEE_ITEMS = [
  '🚗 BMW', '🏎 Mercedes', '⚡ Tesla', '🚙 Toyota', '🔑 Porsche',
  '💎 Lexus', '🚘 Audi', '🏁 Ferrari', '🚗 BMW', '🏎 Mercedes',
  '⚡ Tesla', '🚙 Toyota', '🔑 Porsche', '💎 Lexus', '🚘 Audi', '🏁 Ferrari',
];

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: '#0f0f0e' }}>
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 80% at 20% 50%, rgba(200,50,26,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 30%, rgba(200,50,26,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 60% 80%, rgba(120,20,10,0.15) 0%, transparent 60%)
          `,
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c8321a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Scrolling marquee */}
      <div className="relative overflow-hidden border-b border-white/5 py-3">
        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ animation: 'marquee 28s linear infinite' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-sm font-semibold text-white/20 shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(-32px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <span
              className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-4 px-3 py-1 rounded-full"
              style={{ color: '#f0856a', background: 'rgba(200,50,26,0.15)', border: '1px solid rgba(200,50,26,0.25)' }}
            >
              Source On Demand
            </span>
            <h2
              className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Can&apos;t find
              <br />
              <span style={{ color: 'var(--accent)' }}>what you need?</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              We source vehicles to order from Japan, Europe, USA, and Korea. Tell us exactly what you want — make, model, spec, budget — and we&apos;ll find it.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className="btn btn-primary px-8 py-3.5 rounded-xl text-sm font-bold"
                style={{ boxShadow: '0 4px 24px rgba(200,50,26,0.5)' }}
              >
                Request a Vehicle →
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn px-8 py-3.5 rounded-xl text-sm font-bold text-white"
                style={{ background: '#25d366', boxShadow: '0 4px 20px rgba(37,211,102,0.3)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* Right — animated feature cards */}
          <div
            className="grid grid-cols-2 gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateX(32px)',
              transition: 'opacity 0.7s 0.15s ease, transform 0.7s 0.15s ease',
            }}
          >
            {[
              { icon: '🇯🇵', label: 'Japan', desc: 'JDM & auction vehicles' },
              { icon: '🇩🇪', label: 'Germany', desc: 'Euro spec, VAT reclaim' },
              { icon: '🇺🇸', label: 'USA', desc: 'USDM imports & salvage' },
              { icon: '🇰🇷', label: 'Korea', desc: 'KDM new & used stock' },
            ].map((card, i) => (
              <div
                key={card.label}
                className="rounded-2xl p-5 border transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  animationDelay: `${i * 0.1}s`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.5s ${0.2 + i * 0.1}s ease, transform 0.5s ${0.2 + i * 0.1}s ease`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(200,50,26,0.4)';
                  e.currentTarget.style.background = 'rgba(200,50,26,0.08)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <p className="font-bold text-white text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>{card.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
