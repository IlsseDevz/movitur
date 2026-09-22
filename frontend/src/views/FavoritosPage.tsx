'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card } from '@/components';
import { FavoritoButton } from '@/components/FavoritoButton';
import { useFavoritos } from '@/context/FavoritosContext';
import { favoritoService } from '@/services';
import type { Favorito } from '@/types';

export function FavoritosPage() {
  const { destinoIds, guiaIds } = useFavoritos();
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    favoritoService.listar()
      .then(setFavoritos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [destinoIds, guiaIds]);

  const destinos = favoritos.filter((f) => f.tipo === 'DESTINO');
  const guias = favoritos.filter((f) => f.tipo === 'GUIA');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Meus Favoritos</h2>
        <p className="text-gray-500">Destinos e guias que guardou para planear a viagem</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

      {loading ? (
        <p className="text-gray-500 text-center py-8">A carregar...</p>
      ) : favoritos.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-gray-500 mb-4">Ainda nao tem favoritos.</p>
          <Link href="/cliente/destinos">
            <Button variant="accent">Explorar destinos</Button>
          </Link>
        </Card>
      ) : (
        <>
          {destinos.length > 0 && (
            <Card title={`Destinos (${destinos.length})`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {destinos.map((f) => (
                  <div key={f.id} className="flex gap-3 border rounded-xl p-3">
                    {f.imagemUrl ? (
                      <img src={f.imagemUrl} alt={f.nome} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-primary/10 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link href={`/cliente/destinos/${f.itemId}`} className="font-semibold text-primary-dark hover:underline truncate">
                          {f.nome}
                        </Link>
                        <FavoritoButton tipo="DESTINO" itemId={f.itemId} size="sm" />
                      </div>
                      <p className="text-sm text-gray-500">{f.subtitulo}</p>
                      <div className="mt-2"><Badge>Destino</Badge></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {guias.length > 0 && (
            <Card title={`Guias (${guias.length})`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guias.map((f) => (
                  <div key={f.id} className="flex gap-3 border rounded-xl p-3">
                    {f.imagemUrl ? (
                      <img src={f.imagemUrl} alt={f.nome} className="w-20 h-20 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-primary/10 shrink-0 flex items-center justify-center text-primary font-bold text-xl">
                        {f.nome.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link href={`/cliente/guias/${f.itemId}`} className="font-semibold text-primary-dark hover:underline truncate">
                          {f.nome}
                        </Link>
                        <FavoritoButton tipo="GUIA" itemId={f.itemId} size="sm" />
                      </div>
                      <p className="text-sm text-gray-500">{f.subtitulo}</p>
                      <div className="mt-2"><Badge variant="warning">Guia</Badge></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
