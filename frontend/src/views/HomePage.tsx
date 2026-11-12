'use client';

import Link from 'next/link';
import { Card } from '@/components';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center text-white">
        <span className="text-6xl block mb-4">&#9992;</span>

        <h1 className="text-4xl font-bold mb-3">MoviTur</h1>

        <p className="text-lg opacity-90 mb-10">
          Ecossistema Digital de Turismo de Mocambique
        </p>

        <div className="max-w-md mx-auto">
          <Link href="/cliente">
            <Card className="hover:shadow-xl transition-shadow text-left">
              <div className="text-4xl mb-3">&#127758;</div>

              <h2 className="text-xl font-bold text-primary-dark mb-2">
                Portal do Cliente
              </h2>

              <p className="text-gray-600 text-sm">
                Explore destinos turísticos, encontre guias,
                simule viagens e descubra experiências em Moçambique.
              </p>

              <p className="text-primary font-medium text-sm mt-4">
                Entrar no Portal &rarr;
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}