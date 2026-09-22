'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components';
import { renderStars } from '@/components/StarRating';
import { feedbackService } from '@/services';
import type { Feedback, TipoFeedbackAlvo } from '@/types';

function linkParaEntidade(fb: Feedback) {
  switch (fb.tipoAlvo) {
    case 'DESTINO':
      return `/cliente/destinos/${fb.entidadeId}`;
    case 'GUIA':
      return `/cliente/guias/${fb.entidadeId}`;
    case 'HOTEL':
    case 'RESTAURANTE':
      return `/cliente/estabelecimentos/${fb.entidadeId}`;
    default:
      return '#';
  }
}

function labelTipo(tipo: TipoFeedbackAlvo) {
  switch (tipo) {
    case 'DESTINO': return 'Destino';
    case 'GUIA': return 'Guia';
    case 'HOTEL': return 'Hotel';
    case 'RESTAURANTE': return 'Restaurante';
  }
}

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short' });
}

export function FeedbackRecentes() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feedbackService.listarRecentes()
      .then(setFeedbacks)
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (feedbacks.length === 0) return null;

  return (
    <Card className="border-gray-100 bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-primary-dark mb-1">Opinioes recentes dos clientes</h3>
      <p className="text-sm text-gray-500 mb-4">Comentarios sobre destinos, guias, hoteis e restaurantes.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {feedbacks.slice(0, 6).map((fb) => (
          <Link
            key={fb.id}
            href={linkParaEntidade(fb)}
            className="block p-3 bg-white rounded-lg border border-gray-100 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-medium text-primary uppercase">{labelTipo(fb.tipoAlvo)}</span>
              {renderStars(fb.estrelas, 'sm')}
            </div>
            <p className="font-medium text-sm text-gray-900 truncate">{fb.entidadeNome}</p>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">{fb.comentario}</p>
            <p className="text-xs text-gray-400 mt-2">{fb.usuarioNome} · {formatDate(fb.criadoEm)}</p>
          </Link>
        ))}
      </div>
    </Card>
  );
}
