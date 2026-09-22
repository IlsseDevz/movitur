'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components';
import { FeedbackSection } from '@/components/FeedbackSection';
import { routeParamId } from '@/lib/static-export';
import { estabelecimentoService } from '@/services';
import type { Estabelecimento } from '@/types';

export function EstabelecimentoDetalhePage() {
  const id = routeParamId(usePathname());
  const [estabelecimento, setEstabelecimento] = useState<Estabelecimento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const itemId = Number(id);
    if (!itemId) return;
    estabelecimentoService.buscar(itemId)
      .then(setEstabelecimento)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  if (loading) return <p className="text-gray-500 text-center py-8">A carregar...</p>;
  if (error || !estabelecimento) return <p className="text-red-600">{error || 'Estabelecimento nao encontrado.'}</p>;

  const isHotel = estabelecimento.tipo === 'HOTEL';
  const voltarPara = isHotel ? '/cliente/hoteis' : '/cliente/restaurantes';
  const tipoFeedback = isHotel ? 'HOTEL' : 'RESTAURANTE';

  return (
    <div className="space-y-6">
      <Link href={voltarPara} className="text-sm text-primary hover:underline">
        &larr; Voltar aos {isHotel ? 'hoteis' : 'restaurantes'}
      </Link>

      {estabelecimento.imagemUrl && (
        <img
          src={estabelecimento.imagemUrl}
          alt={estabelecimento.nome}
          className="w-full h-64 object-cover rounded-xl"
        />
      )}

      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-primary-dark">{estabelecimento.nome}</h1>
          {estabelecimento.patrocinado && <Badge variant="warning">Destaque</Badge>}
          <Badge variant="warning">{estabelecimento.avaliacaoMedia.toFixed(1)} ★</Badge>
        </div>
        <p className="text-gray-500">
          {estabelecimento.destinoCidade}, {estabelecimento.destinoProvincia}
        </p>
        {estabelecimento.endereco && (
          <p className="text-sm text-gray-500 mt-1">{estabelecimento.endereco}</p>
        )}
        {estabelecimento.precoMedio != null && (
          <p className="mt-3 text-lg font-semibold text-primary">
            Preco medio: {formatMoney(estabelecimento.precoMedio)}
          </p>
        )}
        <p className="mt-4 text-gray-700">
          {estabelecimento.descricao || 'Sem descricao disponivel.'}
        </p>
      </div>

      <FeedbackSection tipoAlvo={tipoFeedback} entidadeId={estabelecimento.id} />
    </div>
  );
}
