'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '▦' },
  { href: '/admin/cars', label: 'Inventory', icon: '🚗' },
  { href: '/admin/cars/new', label: 'Add Car', icon: '+' },
  { href: '/admin/cms', label: 'CMS', icon: '✏' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem('adminAuth') === 'true') setAuthed(true);
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        sessionStorage.setItem('adminAuth', 'true');
        setAuthed(true);
      } else {
        setError('Incorrect password. Default: admin123');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('adminAuth');
    setAuthed(false);
    router.push('/');
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f0f0e' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-black mx-auto mb-4" style={{ background: 'var(--accent)' }}>V</div>
            <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>Admin Access</h1>
            <p className="text-gray-500 text-sm">VAAM Motors Management Panel</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-white text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
                placeholder="Enter admin password"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm px-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all"
              style={{ background: loading ? '#888' : 'var(--accent)' }}
            >
              {loading ? 'Verifying…' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f4f1' }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 flex flex-col transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}
        style={{ background: '#0f0f0e', minHeight: '100vh' }}
      >
        <div className="p-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black shrink-0" style={{ background: 'var(--accent)' }}>V</div>
            <div>
              <p className="text-white font-bold text-sm" style={{ fontFamily: 'Syne, sans-serif' }}>VAAM Motors</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: active ? 'rgba(200,50,26,0.15)' : 'transparent',
                  color: active ? '#f0856a' : '#9ca3af',
                }}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/8 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors"
          >
            <span className="w-5 text-center">↗</span>
            View Site
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 transition-colors"
          >
            <span className="w-5 text-center">⏻</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[var(--border)] px-6 h-14 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-semibold text-[var(--text)] lg:hidden">Admin Panel</p>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link href="/admin/cars/new" className="btn btn-primary text-xs px-4 py-2">
              + Add Car
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
