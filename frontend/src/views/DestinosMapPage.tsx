'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Select } from '@/components';
import { DestinoMap, destinosComCoordenadas } from '@/components/DestinoMapLazy';
import { destinoService } from '@/services';
import { buscarRotaRodoviaria, MAPUTO_ORIGEM, type RotaResultado } from '@/services/routeService';
import type { Destino } from '@/types';

export function DestinosMapPage() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rotaDestinoId, setRotaDestinoId] = useState<number | ''>('');
  const [rota, setRota] = useState<RotaResultado | null>(null);
  const [rotaLoading, setRotaLoading] = useState(false);
  const [rotaError, setRotaError] = useState('');

  useEffect(() => {
    destinoService.listar({ ativo: true })
      .then(setDestinos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const marcadores = destinosComCoordenadas(destinos);
  const semCoords = destinos.length - marcadores.length;

  const carregarRota = useCallback(async (destinoId: number) => {
    const destino = marcadores.find((d) => d.id === destinoId);
    if (!destino) return;

    setRotaDestinoId(destinoId);
    setRotaLoading(true);
    setRotaError('');
    setRota(null);

    try {
      const resultado = await buscarRotaRodoviaria(MAPUTO_ORIGEM, destino);
      setRota(resultado);
    } catch (e) {
      setRotaError(e instanceof Error ? e.message : 'Erro ao calcular rota');
    } finally {
      setRotaLoading(false);
    }
  }, [marcadores]);

  function limparRota() {
    setRotaDestinoId('');
    setRota(null);
    setRotaError('');
  }

  const destinoRota = marcadores.find((d) => d.id === rotaDestinoId);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">Mapa de destinos</h2>
          <p className="text-gray-500">
            Explore destinos e veja a rota rodoviaria estimada desde Maputo
          </p>
        </div>
        <Link
          href="/cliente/destinos"
          className="text-sm text-primary font-medium hover:underline shrink-0"
        >
          Ver lista de destinos
        </Link>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500 text-center py-8">A carregar mapa...</p>
      ) : (
        <>
          <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <Select
                label="Rota desde Maputo para"
                options={[
                  { value: '', label: 'Seleccione um destino...' },
                  ...marcadores.map((d) => ({ value: d.id, label: d.nome })),
                ]}
                value={rotaDestinoId}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (id) carregarRota(id);
                  else limparRota();
                }}
              />
              {rotaDestinoId && (
                <button
                  type="button"
                  onClick={limparRota}
                  className="text-sm text-gray-500 hover:text-primary text-left sm:pb-2"
                >
                  Limpar rota
                </button>
              )}
            </div>

            {rotaLoading && (
              <p className="mt-3 text-sm text-gray-500">A calcular rota rodoviaria...</p>
            )}
            {rotaError && (
              <p className="mt-3 text-sm text-red-600">{rotaError}</p>
            )}
            {rota && destinoRota && (
              <div className="mt-3 p-3 bg-primary/5 rounded-lg text-sm text-gray-700">
                <strong>{MAPUTO_ORIGEM.nome}</strong> → <strong>{destinoRota.nome}</strong>
                <span className="mx-2">·</span>
                {rota.distanciaKm} km
                <span className="mx-2">·</span>
                ~{rota.duracaoHoras} h de viagem (estimativa por estrada)
              </div>
            )}
          </div>

          <DestinoMap
            destinos={marcadores}
            height="520px"
            origem={MAPUTO_ORIGEM}
            rota={rota}
            rotaDestinoId={rotaDestinoId || null}
            onDestinoClick={carregarRota}
          />
          <p className="mt-3 text-sm text-gray-500">
            {marcadores.length} destino(s) no mapa
            {semCoords > 0 && ` · ${semCoords} sem coordenadas definidas`}
            {' · '}Clique num destino ou use o selector para ver a trajectoria
          </p>
        </>
      )}
    </div>
  );
}
