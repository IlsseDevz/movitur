'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="border-b border-slate-700 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link href="/admin/login" className="flex items-center gap-2">
            <span className="text-2xl">&#9881;</span>
            <div>
              <p className="font-bold text-white">MoviTur</p>
              <p className="text-xs text-slate-400">Back Office</p>
            </div>
          </Link>
          <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
            Sair
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
