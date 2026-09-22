'use client';

import { useState } from 'react';
import Link from 'next/link';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components';
import { useAuth } from '@/context/AuthContext';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/cliente/categorias', label: 'Categorias' },
  { href: '/cliente/destinos', label: 'Destinos' },
  { href: '/cliente/guias', label: 'Guias' },
  { href: '/cliente/simulador', label: 'Simulador' },
];

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <span className="text-3xl">&#9992;</span>
            <div>
              <h1 className="text-xl font-bold">MoviTur</h1>
              <p className="text-sm opacity-90 hidden sm:block">Ecossistema Digital de Turismo</p>
            </div>
          </Link>

          <button
            className="md:hidden p-2 rounded-lg bg-white/15"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuAberto
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          <nav className={`${menuAberto ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-2 absolute md:relative top-full left-0 right-0 md:top-auto bg-primary-dark md:bg-transparent p-4 md:p-0 shadow-lg md:shadow-none`}>
            {links.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white text-primary'
                      : 'bg-white/15 hover:bg-white/25 text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="border-t md:border-t-0 border-white/20 pt-2 md:pt-0 md:ml-2 flex flex-col md:flex-row gap-2">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <Link href="/admin" onClick={() => setMenuAberto(false)}>
                      <Button variant="secondary" className="w-full md:w-auto text-sm">
                        Back Office
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/cliente/inicio" onClick={() => setMenuAberto(false)}>
                      <Button variant="accent" className="w-full md:w-auto text-sm">
                        Area Cliente
                      </Button>
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setMenuAberto(false); }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-white/15 hover:bg-white/25 text-white text-left"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link href="/cliente/login" onClick={() => setMenuAberto(false)}>
                    <Button variant="secondary" className="w-full md:w-auto text-sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cliente/registo" onClick={() => setMenuAberto(false)}>
                    <Button variant="accent" className="w-full md:w-auto text-sm">
                      Registar
                    </Button>
                  </Link>
                  <Link href="/admin/login" onClick={() => setMenuAberto(false)} className="hidden md:block">
                    <span className="px-3 py-2 text-xs text-white/70 hover:text-white transition-colors">
                      Admin
                    </span>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
