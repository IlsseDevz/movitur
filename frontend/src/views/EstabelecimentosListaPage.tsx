'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Select } from '@/components';
import { EstabelecimentoCard } from '@/components/EstabelecimentoCard';
import { estabelecimentoService, destinoService } from '@/services';
import type { Destino, Estabelecimento } from '@/types';

interface EstabelecimentosListaPageProps {
  tipo: 'HOTEL' | 'RESTAURANTE';
  titulo: string;
  subtitulo: string;
}

export function EstabelecimentosListaPage({ tipo, titulo, subtitulo }: EstabelecimentosListaPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [items, setItems] = useState<Estabelecimento[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const destinoId = searchParams.get('destinoId') || '';
  const provincia = searchParams.get('provincia') || '';

  useEffect(() => {
    destinoService.listar({ ativo: true }).then(setDestinos).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    estabelecimentoService.listar({
      tipo,
      ativo: true,
      destinoId: destinoId ? Number(destinoId) : undefined,
      provincia: provincia || undefined,
    })
      .then(setItems)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [tipo, destinoId, provincia]);

  const provincias = [...new Set(destinos.map((d) => d.provincia))].sort();

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-dark">{titulo}</h2>
        <p className="text-gray-500">{subtitulo}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
        <Select
          label="Destino"
          options={[{ value: '', label: 'Todos' }, ...destinos.map((d) => ({ value: d.id, label: d.nome }))]}
          value={destinoId}
          onChange={(e) => updateFilter('destinoId', e.target.value)}
        />
        <Select
          label="Provincia"
          options={[{ value: '', label: 'Todas' }, ...provincias.map((p) => ({ value: p, label: p }))]}
          value={provincia}
          onChange={(e) => updateFilter('provincia', e.target.value)}
        />
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500 text-center py-8">A carregar...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum resultado encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((e) => (
            <EstabelecimentoCard key={e.id} estabelecimento={e} />
          ))}
        </div>
      )}
    </div>
  );
}
