'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { NavLink } from '@/components/NavLink';
import { NotificacoesBell } from '@/components/NotificacoesBell';
import { useAuth } from '@/context/AuthContext';

const menu = [
  { href: '/cliente/inicio', label: 'Inicio', end: true },
  { href: '/cliente/categorias', label: 'Categorias' },
  { href: '/cliente/destinos', label: 'Destinos' },
  { href: '/cliente/destinos/mapa', label: 'Mapa' },
  { href: '/cliente/hoteis', label: 'Hoteis' },
  { href: '/cliente/restaurantes', label: 'Restaurantes' },
  { href: '/cliente/guias', label: 'Guias' },
  { href: '/cliente/simulador', label: 'Simulador' },
  { href: '/cliente/poupancas', label: 'Poupancas' },
  { href: '/cliente/favoritos', label: 'Favoritos' },
  { href: '/cliente/reservas', label: 'Reservas' },
  { href: '/cliente/conta', label: 'Minha Conta' },
];

export function ClienteLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform ${sidebarAberta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-gray-100">
          <Link href="/cliente/inicio" className="flex items-center gap-2" onClick={() => setSidebarAberta(false)}>
            <span className="text-2xl">&#9992;</span>
            <div>
              <p className="font-bold text-primary">MoviTur</p>
              <p className="text-xs text-gray-500">Portal do Cliente</p>
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
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            href="/"
            className="block px-4 py-2 text-sm text-gray-500 hover:text-primary transition-colors"
            onClick={() => setSidebarAberta(false)}
          >
            Pagina inicial
          </Link>
          <button
            onClick={() => { logout(); setSidebarAberta(false); }}
            className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Terminar sessao
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarAberta(true)}
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="text-sm text-gray-600">
            <span className="hidden sm:inline">Ola, </span>
            <span className="font-medium text-gray-900">{user?.nomeCompleto}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotificacoesBell />
            <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium hidden sm:inline">
              Cliente
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
