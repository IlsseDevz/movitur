'use client';

import Link from 'next/link';

import { Badge } from '@/components';

import type { Estabelecimento } from '@/types';



interface EstabelecimentoCardProps {

  estabelecimento: Estabelecimento;

  children?: React.ReactNode;

}



export function EstabelecimentoCard({ estabelecimento, children }: EstabelecimentoCardProps) {

  const formatMoney = (v?: number) =>

    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';



  return (

    <Link

      href={`/cliente/estabelecimentos/${estabelecimento.id}`}

      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow"

    >

      {estabelecimento.imagemUrl && (

        <div className="relative">

          <img

            src={estabelecimento.imagemUrl}

            alt={estabelecimento.nome}

            className="w-full h-40 object-cover"

            loading="lazy"

          />

          {estabelecimento.patrocinado && (

            <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">

              Destaque

            </span>

          )}

        </div>

      )}

      <div className="p-5 flex flex-col flex-1">

        <div className="flex items-start justify-between gap-2 mb-1">

          <h3 className="text-lg font-semibold text-primary-dark">{estabelecimento.nome}</h3>

          {!estabelecimento.imagemUrl && estabelecimento.patrocinado && (

            <Badge variant="warning">Patrocinado</Badge>

          )}

        </div>

        <p className="text-sm text-gray-500 mb-2">

          {estabelecimento.destinoCidade}, {estabelecimento.destinoProvincia}

        </p>

        <div className="flex flex-wrap items-center gap-2 mb-2">

          <Badge variant="warning">{estabelecimento.avaliacaoMedia.toFixed(1)} ★</Badge>

          {estabelecimento.patrocinado && estabelecimento.imagemUrl && (

            <Badge variant="info">{estabelecimento.planoAnuncio}</Badge>

          )}

          {estabelecimento.precoMedio != null && (

            <span className="text-sm font-medium text-primary">{formatMoney(estabelecimento.precoMedio)}</span>

          )}

        </div>

        <p className="text-sm text-gray-600 flex-1 line-clamp-2">

          {estabelecimento.descricao || 'Sem descricao disponivel.'}

        </p>

        <p className="text-sm text-primary font-medium mt-3">Ver detalhes e opinioes →</p>
        {children}

      </div>

    </Link>

  );

}

