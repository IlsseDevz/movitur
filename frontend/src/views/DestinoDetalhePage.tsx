'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge, Button, Card } from '@/components';
import { DestinoMap, destinosComCoordenadas } from '@/components/DestinoMapLazy';
import { EstabelecimentoCard } from '@/components/EstabelecimentoCard';
import { FavoritoButton } from '@/components/FavoritoButton';
import { FeedbackSection } from '@/components/FeedbackSection';
import { useAuth } from '@/context/AuthContext';
import { setNavState } from '@/lib/nav-state';
import { routeParamId } from '@/lib/static-export';
import { destinoService, guiaService, estabelecimentoService } from '@/services';
import { buscarRotaRodoviaria, MAPUTO_ORIGEM, type RotaResultado } from '@/services/routeService';
import type { Destino, Estabelecimento, GuiaTuristico } from '@/types';
export function DestinoDetalhePage() {
  const id = routeParamId(usePathname());
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [destino, setDestino] = useState<Destino | null>(null);
  const [guias, setGuias] = useState<GuiaTuristico[]>([]);
  const [hoteis, setHoteis] = useState<Estabelecimento[]>([]);
  const [restaurantes, setRestaurantes] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rota, setRota] = useState<RotaResultado | null>(null);
  const [rotaError, setRotaError] = useState('');
  useEffect(() => {
    const destinoId = Number(id);
    if (!destinoId) return;
    Promise.all([
      destinoService.buscar(destinoId),
      guiaService.listar({ ativo: true, destinoId }),
      estabelecimentoService.listar({ tipo: 'HOTEL', destinoId, ativo: true }),
      estabelecimentoService.listar({ tipo: 'RESTAURANTE', destinoId, ativo: true }),
    ])
      .then(([d, g, h, r]) => { setDestino(d); setGuias(g); setHoteis(h); setRestaurantes(r); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (destino?.latitude == null || destino?.longitude == null) return;
    buscarRotaRodoviaria(
      MAPUTO_ORIGEM,
      { latitude: destino.latitude, longitude: destino.longitude },
    )
      .then(setRota)
      .catch((e) => setRotaError(e instanceof Error ? e.message : 'Erro ao calcular rota'));
  }, [destino]);
  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  function reservar() {
    if (!destino) return;
    const state = { destinoId: destino.id, numeroDias: 3 };
    if (isAuthenticated) {
      setNavState({ reservaPrefill: state });
      router.push('/cliente/reservas');
    } else {
      setNavState({ from: '/cliente/reservas', reservaPrefill: state });
      router.push('/cliente/login');
    }
  }

  if (loading) return <p className="text-gray-500 text-center py-8">A carregar...</p>;
  if (error || !destino) return <p className="text-red-600">{error || 'Destino nao encontrado.'}</p>;

  return (
    <div className="space-y-6">
      <Link href="/cliente/destinos" className="text-sm text-primary hover:underline">&larr; Voltar aos destinos</Link>

      {destino.imagemUrl && (
        <img src={destino.imagemUrl} alt={destino.nome} className="w-full h-64 object-cover rounded-xl" />
      )}

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-primary-dark">{destino.nome}</h1>
          {destino.categoriaNome && <Badge>{destino.categoriaNome}</Badge>}
          <FavoritoButton tipo="DESTINO" itemId={destino.id} />
        </div>
        <p className="text-gray-500">{destino.cidade}, {destino.provincia}</p>
        {(destino.totalFeedbacks ?? 0) > 0 && (
          <p className="mt-2 text-amber-600 font-medium">
            {destino.avaliacaoMedia?.toFixed(1)} ★ · {destino.totalFeedbacks} {destino.totalFeedbacks === 1 ? 'opiniao' : 'opinioes'}
          </p>
        )}
        <p className="mt-4 text-gray-700">{destino.descricao || 'Sem descricao disponivel.'}</p>        <p className="mt-3 text-lg font-semibold text-primary">
          A partir de {formatMoney(destino.precoMedioEstimado)} / dia
        </p>
        <Button className="mt-4" onClick={reservar}>
          {isAuthenticated ? 'Reservar este destino' : 'Reservar (requer conta)'}
        </Button>
      </div>

      <FeedbackSection tipoAlvo="DESTINO" entidadeId={destino.id} />

      {destino.latitude != null && destino.longitude != null && (        <Card title="Localizacao e rota desde Maputo">
          {rota && (
            <p className="text-sm text-gray-600 mb-3">
              Distancia estimada: <strong>{rota.distanciaKm} km</strong>
              {' · '}Tempo de viagem: <strong>~{rota.duracaoHoras} h</strong> (por estrada)
            </p>
          )}
          {rotaError && (
            <p className="text-sm text-amber-700 mb-3">{rotaError}</p>
          )}
          <DestinoMap
            destinos={destinosComCoordenadas([destino])}
            height="320px"
            origem={MAPUTO_ORIGEM}
            rota={rota}
            rotaDestinoId={destino.id}
          />
        </Card>
      )}
      {hoteis.length > 0 && (
        <Card title="Hoteis recomendados">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hoteis.slice(0, 4).map((h) => (
              <EstabelecimentoCard key={h.id} estabelecimento={h} />
            ))}
          </div>
        </Card>
      )}

      {restaurantes.length > 0 && (
        <Card title="Restaurantes recomendados">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {restaurantes.slice(0, 4).map((r) => (
              <EstabelecimentoCard key={r.id} estabelecimento={r} />
            ))}
          </div>
        </Card>
      )}

      {guias.length > 0 && (
        <Card title="Guias disponiveis neste destino">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {guias.map((g) => (
              <Link key={g.id} href={`/cliente/guias/${g.id}`} className="p-3 border rounded-lg hover:border-primary transition-colors">
                <p className="font-medium">{g.nome}</p>
                <p className="text-sm text-gray-500">{g.anosExperiencia} anos · {g.avaliacaoMedia.toFixed(1)} ★</p>
              </Link>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
}
