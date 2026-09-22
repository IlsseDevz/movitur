'use client';

import Link from 'next/link';
import { Card } from '@/components';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center text-white">
        <span className="text-6xl block mb-4">&#9992;</span>
        <h1 className="text-4xl font-bold mb-3">MoviTur</h1>
        <p className="text-lg opacity-90 mb-10">
          Ecossistema Digital de Turismo de Mocambique
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/cliente">
            <Card className="hover:shadow-xl transition-shadow text-left h-full">
              <div className="text-3xl mb-3">&#127758;</div>
              <h2 className="text-xl font-bold text-primary-dark mb-2">Sou Cliente</h2>
              <p className="text-gray-600 text-sm">
                Explore destinos e guias sem conta. Para reservar ou simular viagens, crie conta gratuita.
              </p>
              <p className="text-primary font-medium text-sm mt-4">Explorar Mocambique &rarr;</p>
            </Card>
          </Link>

          <Link href="/admin/login">
            <Card className="hover:shadow-xl transition-shadow text-left h-full">
              <div className="text-3xl mb-3">&#9881;</div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Sou Administrador</h2>
              <p className="text-gray-600 text-sm">
                Gerir aprovacoes de clientes, destinos, guias e conteudos da plataforma.
              </p>
              <p className="text-slate-700 font-medium text-sm mt-4">Aceder ao back office &rarr;</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
