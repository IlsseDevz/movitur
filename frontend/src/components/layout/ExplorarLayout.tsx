'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/context/AuthContext';
import { setNavState } from '@/lib/nav-state';

const nav = [
  { href: '/cliente/categorias', label: 'Categorias' },
  { href: '/cliente/destinos', label: 'Destinos' },
  { href: '/cliente/destinos/mapa', label: 'Mapa' },
  { href: '/cliente/hoteis', label: 'Hoteis' },
  { href: '/cliente/restaurantes', label: 'Restaurantes' },
  { href: '/cliente/guias', label: 'Guias' },
];

const authRequired = [
  { href: '/cliente/simulador', label: 'Simulador' },
  { href: '/cliente/reservas', label: 'Reservas' },
];

export function ExplorarLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);
  const cliente = isAuthenticated && user?.role === 'CLIENTE';

  function fecharMenu() {
    setMenuAberto(false);
  }

  function irProtegido(path: string) {
    fecharMenu();
    if (cliente) {
      router.push(path);
    } else {
      setNavState({ from: path });
      router.push('/cliente/login');
    }
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2.5 rounded-lg text-sm font-medium ${
      isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/cliente" className="flex items-center gap-2 shrink-0" onClick={fecharMenu}>
            <span className="text-2xl">&#9992;</span>
            <div>
              <p className="font-bold text-primary">MoviTur</p>
              <p className="text-xs text-gray-500">Explorar Mocambique</p>
            </div>
          </Link>

          <nav className="hidden md:flex gap-1">
            {nav.map((item) => (
              <NavLink key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            {authRequired.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => irProtegido(item.href)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {cliente ? (
                <>
                  <Link href="/cliente/favoritos" className="text-sm text-gray-600 hover:text-primary">
                    Favoritos
                  </Link>
                  <Link href="/cliente/inicio" className="text-sm font-medium text-primary hover:underline">
                    Area cliente
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/cliente/login" className="text-sm text-gray-600 hover:text-primary">
                    Entrar
                  </Link>
                  <Link href="/cliente/registo" className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg">
                    Registar
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuAberto}
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuAberto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuAberto && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className="max-w-6xl mx-auto px-4 py-3 space-y-1">
              {nav.map((item) => (
                <NavLink key={item.href} href={item.href} onClick={fecharMenu} className={linkClass}>
                  {item.label}
                </NavLink>
              ))}
              {authRequired.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => irProtegido(item.href)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2 space-y-1">
                {cliente ? (
                  <>
                    <Link
                      href="/cliente/favoritos"
                      onClick={fecharMenu}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Favoritos
                    </Link>
                    <Link
                      href="/cliente/inicio"
                      onClick={fecharMenu}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/10"
                    >
                      Area cliente
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/cliente/login"
                      onClick={fecharMenu}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/cliente/registo"
                      onClick={fecharMenu}
                      className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-white text-center"
                    >
                      Registar
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
      {!isAuthenticated && (
        <div className="bg-primary/5 border-b border-primary/10">
          <p className="max-w-6xl mx-auto px-4 py-2 text-sm text-gray-600 text-center">
            A explorar sem conta. Para <strong>reservar</strong> ou usar o <strong>simulador</strong>,{' '}
            <Link href="/cliente/registo" className="text-primary font-medium hover:underline">
              crie conta
            </Link>{' '}
            ou{' '}
            <Link href="/cliente/login" className="text-primary font-medium hover:underline">
              inicie sessao
            </Link>
            .
          </p>
        </div>
      )}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8">{children}</main>
    </div>
  );
}
