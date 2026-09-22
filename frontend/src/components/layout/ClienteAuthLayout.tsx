'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export function ClienteAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/cliente" className="flex items-center gap-2">
            <span className="text-2xl">&#9992;</span>
            <div>
              <p className="font-bold text-primary">MoviTur</p>
              <p className="text-xs text-gray-500">Portal do Cliente</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/cliente/destinos" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Explorar sem conta
            </Link>
            <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
              Pagina inicial
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </main>
    </div>
  );
}
