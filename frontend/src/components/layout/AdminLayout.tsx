'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { NavLink } from '@/components/NavLink';
import { NotificacoesBell } from '@/components/NotificacoesBell';
import { useAuth } from '@/context/AuthContext';

const menu = [
  { href: '/admin', label: 'Dashboard', end: true },
  { href: '/admin/usuarios', label: 'Utilizadores' },
  { href: '/admin/categorias', label: 'Categorias' },
  { href: '/admin/destinos', label: 'Destinos' },
  { href: '/admin/guias', label: 'Guias' },
  { href: '/admin/estabelecimentos', label: 'Estabelecimentos' },
  { href: '/admin/reservas', label: 'Reservas' },
  { href: '/admin/pagamentos', label: 'Pagamentos' },
  { href: '/admin/relatorios', label: 'Relatorios' },
  { href: '/admin/feedback', label: 'Feedback' },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 border-r border-slate-700 flex flex-col transform transition-transform ${sidebarAberta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-slate-700">
          <Link href="/admin" className="flex items-center gap-2" onClick={() => setSidebarAberta(false)}>
            <span className="text-2xl">&#9881;</span>
            <div>
              <p className="font-bold text-white">MoviTur</p>
              <p className="text-xs text-slate-400">Back Office</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              end={item.end}
              onClick={() => setSidebarAberta(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-2">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
            onClick={() => setSidebarAberta(false)}
          >
            Ver site publico
          </Link>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm text-left text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
          >
            Terminar sessao
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-slate-700 text-slate-300"
            onClick={() => setSidebarAberta(true)}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-sm text-slate-300">
            <span className="hidden sm:inline">Administrador: </span>
            <span className="font-medium text-white">{user?.nomeCompleto}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificacoesBell dark />
            <span className="text-xs bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-medium hidden sm:inline">
              Admin
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
