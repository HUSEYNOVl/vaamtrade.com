'use client';

import { useEffect, useRef, useState } from 'react';

const STEPS = [
  {
    n: '01',
    title: 'Browse & Select',
    desc: 'Search our curated global inventory. Filter by make, model, year, condition, and budget.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
    color: '#1a6b3c',
    bg: '#dcfce7',
  },
  {
    n: '02',
    title: 'Certified Inspection',
    desc: 'We run a licensed multi-point inspection and send you a full report with photos before you commit.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.746 3.746 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    color: '#1d4ed8',
    bg: '#dbeafe',
  },
  {
    n: '03',
    title: 'Secure Payment',
    desc: 'Pay through verified, fully encrypted channels. We support wire transfer, escrow, and more.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    color: '#92400e',
    bg: '#fef3c7',
  },
  {
    n: '04',
    title: 'Global Delivery',
    desc: 'We manage all export paperwork, customs clearance, and shipping — delivered to your door.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
    color: 'var(--accent)',
    bg: 'var(--accent-light)',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: '#0f0f0e' }}
    >
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c8321a 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,50,26,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <span
            className="inline-block text-xs font-bold tracking-[0.3em] uppercase mb-3 px-3 py-1 rounded-full"
            style={{ color: '#f0856a', background: 'rgba(200,50,26,0.12)', border: '1px solid rgba(200,50,26,0.2)' }}
          >
            Our Process
          </span>
          <h2
            className="text-3xl md:text-5xl font-extrabold text-white"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            How It Works
          </h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto text-base">
            From search to your driveway — we handle everything
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(32px)',
                transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
              }}
            >
              <div
                className="group relative h-full rounded-2xl p-6 border cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  transition: 'border-color 0.3s, background 0.3s, transform 0.3s',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = `${step.color}55`;
                  el.style.background = 'rgba(255,255,255,0.07)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.04)';
                  el.style.transform = 'none';
                }}
              >
                {/* Step number — large watermark */}
                <div
                  className="absolute top-4 right-4 text-5xl font-black opacity-10 select-none"
                  style={{ fontFamily: 'Syne, sans-serif', color: step.color }}
                >
                  {step.n}
                </div>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: step.bg, color: step.color }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3
                  className="text-white font-bold text-lg mb-2"
                  style={{ fontFamily: 'Syne, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>

                {/* Bottom line */}
                <div
                  className="absolute bottom-0 left-6 right-6 h-px rounded-full mt-4"
                  style={{ background: `linear-gradient(90deg, transparent, ${step.color}66, transparent)` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Connector line (desktop) */}
        <div className="hidden lg:flex absolute top-[13.5rem] left-0 right-0 items-center justify-center pointer-events-none px-[calc(12.5%+3.5rem)]">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,50,26,0.3), rgba(200,50,26,0.3), rgba(200,50,26,0.3), transparent)' }} />
        </div>

        {/* Bottom CTA row */}
        <div
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.6s 0.6s ease, transform 0.6s 0.6s ease',
          }}
        >
          <a
            href="/contact"
            className="btn btn-primary px-7 py-3 rounded-xl text-sm font-bold"
            style={{ boxShadow: '0 4px 24px rgba(200,50,26,0.4)' }}
          >
            Start the Process →
          </a>
          <a
            href="#inventory"
            className="btn text-sm font-semibold text-gray-300 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Browse Inventory
          </a>
        </div>
      </div>
    </section>
  );
}
