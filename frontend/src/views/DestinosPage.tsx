'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Badge, Input, Select } from '@/components';
import { FeedbackRecentes } from '@/components/FeedbackRecentes';
import { FavoritoButton } from '@/components/FavoritoButton';
import { destinoService, categoriaService } from '@/services';
import type { Destino, Categoria, DestinoOrdenacao } from '@/types';

const ORDENACOES: { value: DestinoOrdenacao | ''; label: string }[] = [
  { value: 'NOME_ASC', label: 'Nome (A-Z)' },
  { value: 'NOME_DESC', label: 'Nome (Z-A)' },
  { value: 'PRECO_ASC', label: 'Preco (menor)' },
  { value: 'PRECO_DESC', label: 'Preco (maior)' },
];

export function DestinosPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const q = searchParams.get('q') || '';
  const categoriaId = searchParams.get('categoriaId') || '';
  const provincia = searchParams.get('provincia') || '';
  const precoMin = searchParams.get('precoMin') || '';
  const precoMax = searchParams.get('precoMax') || '';
  const ordenacao = (searchParams.get('ordenacao') || 'NOME_ASC') as DestinoOrdenacao;

  useEffect(() => {
    categoriaService.listar().then((c) => setCategorias(c.filter((x) => x.ativo))).catch(console.error);
    destinoService.listar({ ativo: true }).then((data) => {
      setProvincias([...new Set(data.map((d) => d.provincia))].sort());
    }).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    destinoService.listar({
      ativo: true,
      categoriaId: categoriaId ? Number(categoriaId) : undefined,
      provincia: provincia || undefined,
      q: q || undefined,
      precoMin: precoMin ? Number(precoMin) : undefined,
      precoMax: precoMax ? Number(precoMax) : undefined,
      ordenacao,
    })
      .then(setDestinos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, categoriaId, provincia, precoMin, precoMax, ordenacao]);

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  function limparFiltros() {
    router.push(pathname);
  }

  const temFiltros = q || categoriaId || provincia || precoMin || precoMax || ordenacao !== 'NOME_ASC';

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">Destinos</h2>
          <p className="text-gray-500">Pesquise e filtre os melhores locais turisticos de Mocambique</p>
        </div>
        <Link
          href="/cliente/destinos/mapa"
          className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors shrink-0"
        >
          Ver no mapa
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-6 space-y-4 shadow-sm">
        <Input
          label="Pesquisar"
          placeholder="Nome, cidade, provincia ou descricao..."
          value={q}
          onChange={(e) => updateFilter('q', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select
            label="Categoria"
            options={[{ value: '', label: 'Todas' }, ...categorias.map((c) => ({ value: c.id, label: c.nome }))]}
            value={categoriaId}
            onChange={(e) => updateFilter('categoriaId', e.target.value)}
          />
          <Select
            label="Provincia"
            options={[{ value: '', label: 'Todas' }, ...provincias.map((p) => ({ value: p, label: p }))]}
            value={provincia}
            onChange={(e) => updateFilter('provincia', e.target.value)}
          />
          <Select
            label="Ordenar por"
            options={ORDENACOES}
            value={ordenacao}
            onChange={(e) => updateFilter('ordenacao', e.target.value)}
          />
          <Input
            label="Preco minimo / dia (MZN)"
            type="number"
            min="0"
            placeholder="Ex: 5000"
            value={precoMin}
            onChange={(e) => updateFilter('precoMin', e.target.value)}
          />
          <Input
            label="Preco maximo / dia (MZN)"
            type="number"
            min="0"
            placeholder="Ex: 50000"
            value={precoMax}
            onChange={(e) => updateFilter('precoMax', e.target.value)}
          />
        </div>

        {temFiltros && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{loading ? 'A pesquisar...' : `${destinos.length} resultado(s)`}</span>
            <button type="button" onClick={limparFiltros} className="text-primary hover:underline">
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      {loading ? (
        <p className="text-gray-500 text-center py-8">A carregar...</p>
      ) : destinos.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Nenhum destino encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinos.map((d) => (
            <div key={d.id} className="relative bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
              <div className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1">
                <FavoritoButton tipo="DESTINO" itemId={d.id} size="sm" />
              </div>
              <Link href={`/cliente/destinos/${d.id}`} className="flex flex-col flex-1">
                {d.imagemUrl && (
                  <img src={d.imagemUrl} alt={d.nome} className="w-full h-40 object-cover" loading="lazy" />
                )}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-primary-dark">{d.nome}</h3>
                    {d.categoriaNome && <Badge>{d.categoriaNome}</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{d.cidade}, {d.provincia}</p>
                  {(d.totalFeedbacks ?? 0) > 0 && (
                    <p className="text-sm text-amber-600 mb-2">
                      {d.avaliacaoMedia?.toFixed(1)} ★ · {d.totalFeedbacks} {d.totalFeedbacks === 1 ? 'opiniao' : 'opinioes'}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 flex-1 line-clamp-2">{d.descricao || 'Sem descricao.'}</p>                  <p className="mt-3 text-sm font-semibold text-primary">
                    A partir de {formatMoney(d.precoMedioEstimado)} / dia
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <section className="mt-10 pt-8 border-t border-gray-200">
        <FeedbackRecentes />
      </section>
    </div>
  );
}
