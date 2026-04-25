'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { contactInfo } from '@/config/contact';

/* ── types ────────────────────────────────────────────────── */
interface CarData {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  condition: string;
  mileage?: number | null;
  transmission?: string | null;
  fuelType?: string | null;
  color?: string | null;
  description?: string | null;
  featured?: boolean;
  images: string[];
}

/* ── scroll-reveal hook ───────────────────────────────────── */
function useVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── image gallery ────────────────────────────────────────── */
function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [dir, setDir] = useState<'left' | 'right' | null>(null);

  const go = (next: number, d: 'left' | 'right') => {
    setDir(d);
    setTimeout(() => { setIdx(next); setDir(null); }, 220);
  };
  const prev = () => go(idx === 0 ? images.length - 1 : idx - 1, 'left');
  const next = () => go(idx === images.length - 1 ? 0 : idx + 1, 'right');

  // keyboard nav
  useEffect(() => {
    if (!lightbox) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [lightbox, idx]);

  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl text-gray-300 gap-3" style={{ height: 460, background: '#f0ece4' }}>
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-400">No photos available</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
        .slide-right { animation: slideInRight 0.22s ease forwards; }
        .slide-left  { animation: slideInLeft  0.22s ease forwards; }
      `}</style>

      {/* Main photo */}
      <div
        className="relative rounded-3xl overflow-hidden group cursor-zoom-in mb-3"
        style={{ height: 460, background: '#f0ece4' }}
        onClick={() => setLightbox(true)}
      >
        <div key={idx} className={dir === 'right' ? 'slide-right' : dir === 'left' ? 'slide-left' : ''} style={{ position: 'absolute', inset: 0 }}>
          <Image
            src={images[idx]}
            alt={`${alt} ${idx + 1}`}
            fill
            className="object-cover"
            unoptimized
            priority={idx === 0}
          />
        </div>

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* bottom bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="text-xs font-semibold text-white/80 px-3 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
            {idx + 1} / {images.length}
          </span>
          <span className="text-xs font-medium text-white/70 px-3 py-1 rounded-full flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)' }}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
            Tap to zoom
          </span>
        </div>

        {/* dot indicators */}
        {images.length > 1 && images.length <= 8 && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <span key={i} className="rounded-full transition-all duration-300" style={{ width: i === idx ? 20 : 6, height: 6, background: i === idx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > idx ? 'right' : 'left'); setTimeout(() => { setIdx(i); setDir(null); }, 220); }}
              className="relative shrink-0 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                width: 72, height: 56,
                border: i === idx ? '2px solid var(--accent)' : '2px solid transparent',
                boxShadow: i === idx ? '0 0 0 3px rgba(200,50,26,0.2)' : 'none',
                opacity: i === idx ? 1 : 0.65,
                transform: i === idx ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <Image src={img} alt={`thumb ${i + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(10px)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white z-10"
            style={{ background: 'rgba(255,255,255,0.12)' }}
            onClick={() => setLightbox(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative max-w-5xl w-full h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
            <Image src={images[idx]} alt={alt} fill className="object-contain" unoptimized />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-14 w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-14 w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.12)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </>
            )}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-xs">Use arrow keys to navigate · Esc to close</div>
        </div>
      )}
    </>
  );
}

/* ── spec chip ────────────────────────────────────────────── */
const SPEC_MAP: Record<string, { icon: string; color: string }> = {
  New:        { icon: '✦', color: '#16a34a' },
  Used:       { icon: '◈', color: '#92400e' },
  Automatic:  { icon: '⚙', color: '#2563eb' },
  Manual:     { icon: '🔧', color: '#7c3aed' },
  Electric:   { icon: '⚡', color: '#0891b2' },
  Hybrid:     { icon: '🌿', color: '#16a34a' },
  Gasoline:   { icon: '⛽', color: '#d97706' },
  Petrol:     { icon: '⛽', color: '#d97706' },
  Diesel:     { icon: '🛢', color: '#4b5563' },
};

function SpecChip({ label, value, icon }: { label: string; value: string; icon?: string }) {
  const meta = SPEC_MAP[value] ?? { icon: icon ?? '•', color: 'var(--accent)' };
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="flex items-center gap-1.5 font-black text-sm" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
        <span style={{ color: meta.color }}>{meta.icon}</span>
        {value}
      </span>
    </div>
  );
}

/* ── contact method ───────────────────────────────────────── */
function ContactBtn({ icon, label, href, color, bg }: { icon: React.ReactNode; label: string; href: string; color: string; bg: string }) {
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
      style={{ background: bg }}
    >
      <span className="w-5 h-5 shrink-0">{icon}</span>
      {label}
      <svg className="w-4 h-4 ml-auto opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}

/* ── inline inquiry form ──────────────────────────────────── */
function InquiryForm({ carName }: { carName: string }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: `I'm interested in the ${carName}. Please send me more details.` });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (field: string): React.CSSProperties => ({
    borderColor: focused === field ? 'var(--accent)' : 'var(--border)',
    boxShadow: focused === field ? '0 0 0 3px rgba(200,50,26,0.1)' : 'none',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
    setTimeout(() => setStatus('idle'), 6000);
  };

  const cls = "w-full px-4 py-3 rounded-xl border bg-white text-sm";

  if (status === 'sent') {
    return (
      <div className="text-center py-10 flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(22,163,74,0.1)' }}>✅</div>
        <p className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>Inquiry Sent!</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>We'll be in touch within a few hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Name <span style={{ color: 'var(--accent)' }}>*</span></label>
          <input className={cls} style={inputStyle('name')} placeholder="Your name" required value={form.name}
            onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
            onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Email <span style={{ color: 'var(--accent)' }}>*</span></label>
          <input type="email" className={cls} style={inputStyle('email')} placeholder="your@email.com" required value={form.email}
            onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
            onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Phone</label>
        <input type="tel" className={cls} style={inputStyle('phone')} placeholder="+1 234 567 8900" value={form.phone}
          onChange={e => setForm(s => ({ ...s, phone: e.target.value }))}
          onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)} />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>Message <span style={{ color: 'var(--accent)' }}>*</span></label>
        <textarea rows={3} className={cls} style={{ ...inputStyle('message'), resize: 'none' }} required value={form.message}
          onChange={e => setForm(s => ({ ...s, message: e.target.value }))}
          onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} />
      </div>
      {status === 'error' && <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Something went wrong. Please try WhatsApp instead.</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full py-3.5 rounded-2xl text-white font-black text-sm uppercase tracking-wider transition-all duration-200 disabled:opacity-60"
        style={{ background: 'linear-gradient(135deg,#c8321a,#a02518)', fontFamily: 'Syne, sans-serif', boxShadow: '0 4px 16px rgba(200,50,26,0.3)' }}
      >
        {status === 'sending'
          ? <span className="flex items-center justify-center gap-2"><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending…</span>
          : 'Send Inquiry →'}
      </button>
    </form>
  );
}

/* ── main export ──────────────────────────────────────────── */
export default function CarDetailClient({ car }: { car: CarData }) {
  const isNew = car.condition === 'New';
  const whatsappLink = `https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'm interested in the ${car.year} ${car.make} ${car.model} (${car.currency} ${car.price.toLocaleString()})`)}`;
  const instagramLink = contactInfo.instagramUrl || '#';

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroIn, setHeroIn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 60);
    return () => clearTimeout(t);
  }, []);

  const rightPanel = useVisible(0.08);

  const specs = [
    car.condition && { label: 'Condition', value: car.condition },
    car.transmission && { label: 'Transmission', value: car.transmission },
    car.fuelType && { label: 'Fuel Type', value: car.fuelType },
    car.color && { label: 'Color', value: car.color, icon: '🎨' },
    car.mileage && { label: 'Mileage', value: `${car.mileage.toLocaleString()} mi`, icon: '🏁' },
  ].filter(Boolean) as { label: string; value: string; icon?: string }[];

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0%,100% { box-shadow:0 0 0 0 rgba(200,50,26,0.4); } 50% { box-shadow:0 0 0 8px rgba(200,50,26,0); } }
      `}</style>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

        {/* ── breadcrumb ───────────────────────────────── */}
        <div className="border-b" style={{ borderColor: 'var(--border)', background: 'white' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <a href="/" className="hover:text-[var(--accent)] transition-colors">Home</a>
            <span>/</span>
            <a href="/cars" className="hover:text-[var(--accent)] transition-colors">Inventory</a>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{car.make} {car.model}</span>
          </div>
        </div>

        {/* ── main grid ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10 items-start">

            {/* LEFT: gallery */}
            <div
              ref={heroRef}
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease',
              }}
            >
              <Gallery images={car.images} alt={`${car.make} ${car.model}`} />
            </div>

            {/* RIGHT: details */}
            <div
              ref={rightPanel.ref}
              className="space-y-6"
              style={{
                opacity: rightPanel.visible ? 1 : 0,
                transform: rightPanel.visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s',
              }}
            >
              {/* Title block */}
              <div className="bg-white rounded-3xl border p-7" style={{ borderColor: 'var(--border)', boxShadow: '0 2px 24px rgba(0,0,0,0.05)' }}>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span
                    className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full text-white"
                    style={{ background: isNew ? '#16a34a' : 'var(--accent)', animation: isNew ? 'none' : 'pulse-ring 2.5s ease-in-out infinite' }}
                  >
                    {car.condition}
                  </span>
                  {car.featured && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#fef3c7', color: '#92400e' }}>⭐ Featured</span>
                  )}
                  <span className="text-xs font-medium ml-auto" style={{ color: 'var(--text-muted)' }}>#{car.id.slice(-6).toUpperCase()}</span>
                </div>

                <h1 className="text-3xl font-black leading-tight mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                  {car.make} {car.model}
                </h1>
                <p className="text-base font-semibold mb-5" style={{ color: 'var(--text-muted)' }}>{car.year}</p>

                <div className="flex items-end gap-3">
                  <p className="text-4xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}>
                    {car.currency} {car.price.toLocaleString()}
                  </p>
                  <p className="text-sm mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>negotiable</p>
                </div>
              </div>

              {/* Specs grid */}
              {specs.length > 0 && (
                <div className="bg-white rounded-3xl border p-6" style={{ borderColor: 'var(--border)', boxShadow: '0 2px 24px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>Specifications</h2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {specs.map((s) => (
                      <SpecChip key={s.label} label={s.label} value={s.value} icon={s.icon} />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {car.description && (
                <div className="bg-white rounded-3xl border p-6" style={{ borderColor: 'var(--border)', boxShadow: '0 2px 24px rgba(0,0,0,0.04)' }}>
                  <h2 className="text-sm font-black uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Description</h2>
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text)' }}>{car.description}</p>
                </div>
              )}

              {/* Quick contact */}
              <div className="bg-white rounded-3xl border p-6 space-y-3" style={{ borderColor: 'var(--border)', boxShadow: '0 2px 24px rgba(0,0,0,0.04)' }}>
                <h2 className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>Quick Contact</h2>
                <ContactBtn
                  href={whatsappLink}
                  label="WhatsApp Us"
                  color="#fff"
                  bg="linear-gradient(135deg,#25D366,#1da851)"
                  icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L.057 23.49a.5.5 0 00.609.608l5.763-1.505A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.065-1.383l-.363-.215-3.767.984.999-3.662-.233-.376A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>}
                />
                <ContactBtn
                  href={`mailto:${contactInfo.email}`}
                  label={contactInfo.email || 'Email Us'}
                  color="#fff"
                  bg="linear-gradient(135deg,#c8321a,#a02518)"
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                />
                {contactInfo.instagramUrl && (
                  <ContactBtn
                    href={instagramLink}
                    label="Instagram"
                    color="#fff"
                    bg="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
                    icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                  />
                )}
              </div>

              {/* Send inquiry form */}
              <div className="bg-white rounded-3xl border p-6" style={{ borderColor: 'var(--border)', boxShadow: '0 2px 24px rgba(0,0,0,0.04)' }}>
                <h2 className="text-sm font-black uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>Send an Inquiry</h2>
                <InquiryForm carName={`${car.year} ${car.make} ${car.model}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
