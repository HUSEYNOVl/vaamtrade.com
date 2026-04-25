'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ── tiny hook: fires when element enters viewport ── */
function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── animated counter ── */
function Counter({ end, suffix, duration = 1600 }: { end: number; suffix: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let t0: number | null = null;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setVal(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(end);
    };
    requestAnimationFrame(tick);
  }, [started, end, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    color: '#1d4ed8', bg: '#dbeafe',
    title: 'Global Shipping',
    desc: 'We ship to any country worldwide — handling all logistics, customs, and paperwork end to end.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.746 3.746 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.746 3.746 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    color: '#16a34a', bg: '#dcfce7',
    title: 'Quality Guarantee',
    desc: 'Every vehicle passes a certified multi-point inspection. You receive the full report before committing.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
      </svg>
    ),
    color: '#92400e', bg: '#fef3c7',
    title: 'Competitive Prices',
    desc: 'We source directly from auctions and dealers across Japan, Europe, and the USA — no middlemen.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    color: '#c8321a', bg: '#fff0ed',
    title: '24/7 Support',
    desc: 'Our multilingual team is available around the clock via WhatsApp, WeChat, email, and phone.',
  },
];

const TIMELINE = [
  { year: '2014', title: 'Founded', desc: 'Started as a small export operation connecting Chinese buyers with Japanese auction cars.' },
  { year: '2017', title: 'Global Expansion', desc: 'Expanded into Middle Eastern and African markets, shipping to 25+ countries.' },
  { year: '2020', title: 'Digital Platform', desc: 'Launched our online inventory platform and multilingual support team.' },
  { year: '2024', title: 'Industry Leader', desc: '500+ exports, 50+ countries served, and a 99% satisfaction rating from our clients.' },
];

const STATS = [
  { end: 500, suffix: '+', label: 'Cars Exported' },
  { end: 50, suffix: '+', label: 'Countries' },
  { end: 10, suffix: '+', label: 'Years Active' },
  { end: 99, suffix: '%', label: 'Satisfaction' },
];

export default function AboutPageClient() {
  const hero = useVisible(0.1);
  const mission = useVisible(0.2);
  const features = useVisible(0.1);
  const timeline = useVisible(0.1);
  const team = useVisible(0.1);

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ── HERO ───────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: '#0f0f0e', minHeight: 400 }}>
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, #c8321a 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-72 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(200,50,26,0.15) 0%, transparent 70%)' }} />
        {/* bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />

        <div
          ref={hero.ref}
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              background: 'rgba(200,50,26,0.12)', color: '#f0856a',
              border: '1px solid rgba(200,50,26,0.25)',
              opacity: hero.visible ? 1 : 0,
              transform: hero.visible ? 'none' : 'translateY(16px)',
              transition: 'all 0.5s ease',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#f0856a] animate-pulse" />
            Licensed Since 2014
          </div>

          <h1
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-5"
            style={{
              fontFamily: 'Syne, sans-serif',
              opacity: hero.visible ? 1 : 0,
              transform: hero.visible ? 'none' : 'translateY(24px)',
              transition: 'all 0.65s 0.1s ease',
            }}
          >
            About
            <span style={{ color: 'var(--accent)' }}> VAAM Motors</span>
          </h1>

          <p
            className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed"
            style={{
              opacity: hero.visible ? 1 : 0,
              transform: hero.visible ? 'none' : 'translateY(24px)',
              transition: 'all 0.65s 0.2s ease',
            }}
          >
            We connect buyers worldwide with premium vehicles — sourced from Japan, Europe, and the USA, inspected, and delivered to your door.
          </p>

          {/* Stats row */}
          <div
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{
              opacity: hero.visible ? 1 : 0,
              transform: hero.visible ? 'none' : 'translateY(24px)',
              transition: 'all 0.65s 0.35s ease',
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl p-5 border" style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.07)' }}>
                <p className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div ref={mission.ref} className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div style={{ opacity: mission.visible ? 1 : 0, transform: mission.visible ? 'none' : 'translateX(-32px)', transition: 'all 0.7s ease' }}>
              <span className="text-xs font-bold uppercase tracking-[0.25em] mb-3 block" style={{ color: 'var(--accent)' }}>Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-5 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                Making premium cars accessible to everyone, everywhere
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-5">
                We believe geography shouldn&apos;t limit your choice of vehicle. Whether you&apos;re in Azerbaijan, Nigeria, Kazakhstan, or the Philippines — you deserve access to the same quality cars available in Japan or Germany.
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed">
                VAAM Motors was founded to bridge that gap: a fully licensed export company with deep auction access, certified inspection partners, and logistics networks in 50+ countries.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 mt-7 font-semibold text-sm px-6 py-3 rounded-xl btn btn-primary"
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Right — visual card stack */}
            <div
              className="relative"
              style={{ opacity: mission.visible ? 1 : 0, transform: mission.visible ? 'none' : 'translateX(32px)', transition: 'all 0.7s 0.15s ease' }}
            >
              {/* Back card */}
              <div
                className="absolute inset-0 rounded-3xl rotate-3 translate-y-2"
                style={{ background: 'var(--accent-light)', border: '1.5px solid rgba(200,50,26,0.2)' }}
              />
              {/* Front card */}
              <div className="relative rounded-3xl p-8 border bg-white shadow-xl" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                    <svg className="w-6 h-6" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>Fully Licensed</p>
                    <p className="text-xs text-[var(--text-muted)]">Import-Export Registration</p>
                  </div>
                </div>
                {[
                  { label: 'Source Markets', val: 'Japan · Germany · USA · Korea' },
                  { label: 'Delivery Countries', val: '50+ worldwide' },
                  { label: 'Languages Supported', val: 'EN · ZH · RU · AR' },
                  { label: 'Payment Methods', val: 'Wire · Escrow · TT' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                    <span className="text-xs text-[var(--text-muted)]">{r.label}</span>
                    <span className="text-xs font-semibold text-[var(--text)]">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#0f0f0e' }}>
        <div ref={features.ref} className="max-w-5xl mx-auto">
          <div
            className="text-center mb-14"
            style={{ opacity: features.visible ? 1 : 0, transform: features.visible ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] mb-3 block" style={{ color: '#f0856a' }}>Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              What makes us different
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl p-6 border cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  opacity: features.visible ? 1 : 0,
                  transform: features.visible ? 'none' : 'translateY(28px)',
                  transition: `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease, border-color 0.3s ease, background 0.3s ease`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${f.color}44`;
                  el.style.background = 'rgba(255,255,255,0.07)';
                  el.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.transform = 'none';
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110" style={{ background: f.bg, color: f.color }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1.5" style={{ fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div ref={timeline.ref} className="max-w-3xl mx-auto">
          <div
            className="text-center mb-14"
            style={{ opacity: timeline.visible ? 1 : 0, transform: timeline.visible ? 'none' : 'translateY(24px)', transition: 'all 0.6s ease' }}
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] mb-3 block" style={{ color: 'var(--accent)' }}>Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
              A decade of growth
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-px"
              style={{
                background: 'linear-gradient(to bottom, transparent, var(--accent), var(--accent), transparent)',
                opacity: timeline.visible ? 0.3 : 0,
                transition: 'opacity 0.8s 0.3s ease',
              }}
            />

            {TIMELINE.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.year}
                  className={`relative flex items-center mb-10 ${isLeft ? 'justify-start' : 'justify-end'}`}
                  style={{
                    opacity: timeline.visible ? 1 : 0,
                    transform: timeline.visible ? 'none' : `translateX(${isLeft ? '-24px' : '24px'})`,
                    transition: `opacity 0.6s ${i * 0.15}s ease, transform 0.6s ${i * 0.15}s ease`,
                  }}
                >
                  {/* Card */}
                  <div
                    className="w-5/12 rounded-2xl p-5 border bg-white shadow-sm"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <span className="text-xs font-black tracking-wider mb-2 block" style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}>
                      {item.year}
                    </span>
                    <h3 className="font-bold text-[var(--text)] mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{item.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Center dot */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white"
                    style={{ background: 'var(--accent)', boxShadow: '0 0 0 4px rgba(200,50,26,0.2)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM / CTA ─────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div
          ref={team.ref}
          className="max-w-3xl mx-auto text-center"
          style={{ opacity: team.visible ? 1 : 0, transform: team.visible ? 'none' : 'translateY(28px)', transition: 'all 0.7s ease' }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: 'var(--accent)' }}>Get Started</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
            Ready to find your vehicle?
          </h2>
          <p className="text-[var(--text-muted)] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Browse our inventory or contact us directly. Our team speaks English, Chinese, Russian, and Arabic.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/" className="btn btn-primary px-8 py-3.5 rounded-xl font-bold text-sm" style={{ boxShadow: '0 4px 20px rgba(200,50,26,0.35)' }}>
              Browse Inventory →
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank" rel="noopener noreferrer"
              className="btn px-8 py-3.5 rounded-xl font-bold text-sm text-white"
              style={{ background: '#25d366', boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
