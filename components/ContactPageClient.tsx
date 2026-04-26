'use client';

import { useRef, useEffect, useState, FormEvent } from 'react';
import { contactInfo } from '@/config/contact';

/* ── scroll-reveal hook ─────────────────────────────────────── */
function useVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ── contact method card ────────────────────────────────────── */
function ContactMethod({
  icon, label, value, href, color, delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: string;
  delay: string;
}) {
  const { ref, visible } = useVisible();
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: delay,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-28px)',
        transition: 'opacity 0.55s ease, transform 0.55s ease',
      }}
    >
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 rounded-2xl border group transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--border)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = color;
          (e.currentTarget as HTMLElement).style.background = color + '08';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLElement).style.background = 'var(--bg)';
        }}
      >
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: color + '18', color }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          <p className="text-sm font-bold truncate" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{value}</p>
        </div>
        <svg className="w-4 h-4 ml-auto shrink-0 opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

/* ── form field ─────────────────────────────────────────────── */
function Field({
  label, required, children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
        {label}{required && <span className="ml-1" style={{ color: 'var(--accent)' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const INPUT = {
  className: 'w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all duration-200 bg-white',
  style: { borderColor: 'var(--border)', color: 'var(--text)' } as React.CSSProperties,
};

/* ── main component ─────────────────────────────────────────── */
export default function ContactPageClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeroVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) setFormState({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 5000);
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    ...INPUT.style,
    borderColor: focusedField === field ? 'var(--accent)' : 'var(--border)',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(200,50,26,0.1)' : 'none',
  });

  const whatsappLink = `https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scanLine { from { top:-2px; } to { top:100%; } }
        @keyframes pulse-dot { 0%,100% { transform:scale(1); opacity:.9; } 50% { transform:scale(1.5); opacity:.4; } }
        .field-input:focus { outline:none; }
        .send-btn { position:relative; overflow:hidden; }
        .send-btn::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); transform:translateX(-100%); transition:transform 0.5s ease; }
        .send-btn:not(:disabled):hover::before { transform:translateX(100%); }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden flex items-center"
        style={{ background: '#080807', minHeight: '320px' }}
      >
        {/* dot grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #c8321a 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        {/* glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(200,50,26,0.12) 0%, transparent 70%)' }} />
        {/* scan line */}
        <div className="absolute left-0 right-0 h-px opacity-20 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', animation: 'scanLine 4s linear infinite', top: 0 }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full text-center">
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.7s ease, transform 0.7s ease',
            }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: 'rgba(200,50,26,0.15)', color: 'var(--accent)', border: '1px solid rgba(200,50,26,0.2)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              We're available now
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-4 leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
              Let's <span style={{ color: 'var(--accent)' }}>Talk</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              Have a car in mind? Send us a message and we'll get back to you within hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── BODY ───────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* LEFT — info panel ─────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* heading */}
              <div>
                <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                  Get in Touch
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  We import premium vehicles from Japan, Germany, USA & Korea. Tell us what you're looking for.
                </p>
              </div>

              {/* contact methods */}
              <div className="space-y-3">
                {contactInfo.phoneNumber && (
                  <ContactMethod
                    icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                    label="Phone"
                    value={contactInfo.phoneNumber}
                    href={`tel:${contactInfo.phoneNumber}`}
                    color="#3B82F6"
                    delay="0ms"
                  />
                )}
                <ContactMethod
                  icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.532 5.845L.057 23.49a.5.5 0 00.609.608l5.763-1.505A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.944 9.944 0 01-5.065-1.383l-.363-.215-3.767.984.999-3.662-.233-.376A9.963 9.963 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>}
                  label="WhatsApp"
                  value={contactInfo.whatsappNumber}
                  href={whatsappLink}
                  color="#25D366"
                  delay="80ms"
                />
                <ContactMethod
                  icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
                  label="Email"
                  value={contactInfo.email || 'contact@vaamcarsale.com'}
                  href={`mailto:${contactInfo.email}`}
                  color="#c8321a"
                  delay="80ms"
                />
                {contactInfo.instagramUrl && (
                  <ContactMethod
                    icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>}
                    label="Instagram"
                    value="Follow us"
                    href={contactInfo.instagramUrl}
                    color="#E1306C"
                    delay="160ms"
                  />
                )}
                {contactInfo.wechatId && (
                  <ContactMethod
                    icon={<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045.245.245 0 00.24-.247c0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 01.177-.554C23.102 18.78 24 17.229 24 15.457c0-3.528-3.315-6.399-7.063-6.599zm-3.082 3.auction c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982zm4.964 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/></svg>}
                    label="WeChat"
                    value={contactInfo.wechatId}
                    href={`weixin://dl/chat?${contactInfo.wechatId}`}
                    color="#07C160"
                    delay="240ms"
                  />
                )}
              </div>

              {/* Hours card */}
              <HoursCard />

              {/* trust strip */}
              <TrustStrip />
            </div>

            {/* RIGHT — form ──────────────────────────────── */}
            <div className="lg:col-span-3">
              <FormCard
                formState={formState}
                setFormState={setFormState}
                status={status}
                focusedField={focusedField}
                setFocusedField={setFocusedField}
                handleSubmit={handleSubmit}
                inputStyle={inputStyle}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── hours card ─────────────────────────────────────────────── */
function HoursCard() {
  const { ref, visible } = useVisible();
  return (
    <div
      ref={ref}
      className="rounded-2xl p-5 border"
      style={{
        background: 'rgba(200,50,26,0.04)',
        borderColor: 'rgba(200,50,26,0.15)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.55s ease 0.3s, transform 0.55s ease 0.3s',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🕐</span>
        <h3 className="font-bold text-sm uppercase tracking-widest" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>Business Hours</h3>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Monday – Friday</p>
      <p className="font-bold text-lg mt-1" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>9:00 AM – 6:00 PM</p>
      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>We typically reply within 2 hours</p>
    </div>
  );
}

/* ── trust strip ────────────────────────────────────────────── */
function TrustStrip() {
  const { ref, visible } = useVisible();
  const items = ['🛡 Licensed Exporter', '✅ Verified Inspection', '🌍 50+ Countries'];
  return (
    <div
      ref={ref}
      className="flex flex-wrap gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s',
      }}
    >
      {items.map((b) => (
        <span key={b} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
          {b}
        </span>
      ))}
    </div>
  );
}

/* ── form card ──────────────────────────────────────────────── */
function FormCard({
  formState, setFormState, status, focusedField, setFocusedField, handleSubmit, inputStyle,
}: {
  formState: { name: string; email: string; phone: string; message: string };
  setFormState: React.Dispatch<React.SetStateAction<typeof formState>>;
  status: 'idle' | 'sending' | 'sent' | 'error';
  focusedField: string | null;
  setFocusedField: (f: string | null) => void;
  handleSubmit: (e: FormEvent) => void;
  inputStyle: (f: string) => React.CSSProperties;
}) {
  const { ref, visible } = useVisible(0.1);

  const inputBase = "w-full px-4 py-3 rounded-xl border text-sm field-input transition-all duration-200 bg-white";

  return (
    <div
      ref={ref}
      className="rounded-3xl border p-8 sm:p-10"
      style={{
        background: 'white',
        borderColor: 'var(--border)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
          Send Us a Message
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Fill out the form and our team will get back to you shortly.
        </p>
      </div>

      {status === 'sent' ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'rgba(22,163,74,0.1)' }}>✅</div>
          <h3 className="text-xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>Message Sent!</h3>
          <p className="text-sm max-w-xs" style={{ color: 'var(--text-muted)' }}>We'll get back to you within a few hours. Check your inbox for a confirmation.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Name <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                className={inputBase}
                style={inputStyle('name')}
                placeholder="Your full name"
                value={formState.name}
                required
                onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                Email <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input
                type="email"
                className={inputBase}
                style={inputStyle('email')}
                placeholder="your@email.com"
                value={formState.email}
                required
                onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Phone
            </label>
            <input
              type="tel"
              className={inputBase}
              style={inputStyle('phone')}
              placeholder="+1 234 567 8900"
              value={formState.phone}
              onChange={(e) => setFormState(s => ({ ...s, phone: e.target.value }))}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              Message <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea
              rows={5}
              className={inputBase}
              style={{ ...inputStyle('message'), resize: 'none' }}
              placeholder="Tell us what car you're looking for, your budget, destination country..."
              value={formState.message}
              required
              onChange={(e) => setFormState(s => ({ ...s, message: e.target.value }))}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          {status === 'error' && (
            <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Something went wrong. Please try again or contact us via WhatsApp.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="send-btn w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-wider transition-all duration-300 disabled:opacity-60"
            style={{
              background: status === 'sending'
                ? 'var(--accent)'
                : 'linear-gradient(135deg, #c8321a 0%, #a02518 100%)',
              fontFamily: 'Syne, sans-serif',
              boxShadow: status === 'sending' ? 'none' : '0 4px 20px rgba(200,50,26,0.35)',
              transform: status === 'sending' ? 'scale(0.99)' : 'scale(1)',
            }}
          >
            {status === 'sending' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending…
              </span>
            ) : 'Send Message →'}
          </button>
        </form>
      )}
    </div>
  );
}
