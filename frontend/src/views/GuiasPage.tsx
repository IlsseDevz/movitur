'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components';
import { FavoritoButton } from '@/components/FavoritoButton';
import { guiaService } from '@/services';
import type { GuiaTuristico } from '@/types';

export function GuiasPage() {
  const [guias, setGuias] = useState<GuiaTuristico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    guiaService.listar()
      .then((data) => setGuias(data.filter((g) => g.ativo)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-dark">Guias Turisticos</h2>
        <p className="text-gray-500">Conheca os guias e leia avaliacoes de outros viajantes</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500 text-center py-8">A carregar...</p>
      ) : guias.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum guia disponivel.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guias.map((g) => (
            <Card key={g.id} className="h-full hover:shadow-lg transition-shadow relative">
              <div className="absolute top-3 right-3 z-10">
                <FavoritoButton tipo="GUIA" itemId={g.id} size="sm" />
              </div>
              <Link href={`/cliente/guias/${g.id}`}>
                <div className="flex items-center gap-3 mb-3">
                  {g.fotoUrl ? (
                    <img src={g.fotoUrl} alt={g.nome} className="w-14 h-14 rounded-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                      {g.nome.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark">{g.nome}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="warning">{g.avaliacaoMedia.toFixed(1)} ★</Badge>
                      <span>{g.anosExperiencia} anos</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{g.biografia || 'Sem biografia disponivel.'}</p>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
