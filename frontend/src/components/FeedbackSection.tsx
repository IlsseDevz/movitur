'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components';
import { StarRating, renderStars } from '@/components/StarRating';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { feedbackService } from '@/services';
import type { Feedback, FeedbackResumo, TipoFeedbackAlvo } from '@/types';

interface FeedbackSectionProps {
  tipoAlvo: TipoFeedbackAlvo;
  entidadeId: number;
}

function formatDate(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function FeedbackSection({ tipoAlvo, entidadeId }: FeedbackSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [resumo, setResumo] = useState<FeedbackResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [estrelas, setEstrelas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const [lista, resumoData] = await Promise.all([
        feedbackService.listarPorEntidade(tipoAlvo, entidadeId),
        feedbackService.resumoPorEntidade(tipoAlvo, entidadeId),
      ]);
      setFeedbacks(lista);
      setResumo(resumoData);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao carregar feedbacks', 'error');
    } finally {
      setLoading(false);
    }
  }, [tipoAlvo, entidadeId, showToast]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (estrelas < 1) {
      showToast('Selecione uma classificacao em estrelas.', 'error');
      return;
    }
    if (!comentario.trim()) {
      showToast('Escreva o seu comentario.', 'error');
      return;
    }

    setEnviando(true);
    try {
      await feedbackService.criar({
        tipoAlvo,
        entidadeId,
        estrelas,
        comentario: comentario.trim(),
      });
      showToast('Feedback enviado com sucesso!', 'success');
      setEstrelas(0);
      setComentario('');
      await carregar();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao enviar feedback', 'error');
    } finally {
      setEnviando(false);
    }
  }

  const isCliente = isAuthenticated && user?.role === 'CLIENTE';

  return (
    <Card title={`Opinioes dos clientes${resumo ? ` (${resumo.total})` : ''}`}>
      {resumo && resumo.total > 0 && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          <span className="text-2xl font-bold text-amber-500">{resumo.mediaEstrelas.toFixed(1)}</span>
          {renderStars(Math.round(resumo.mediaEstrelas), 'md')}
          <span className="text-sm text-gray-500">
            {resumo.total} {resumo.total === 1 ? 'avaliacao' : 'avaliacoes'}
          </span>
        </div>
      )}

      {isCliente ? (
        <form onSubmit={enviar} className="mb-6 p-4 bg-slate-50 rounded-lg space-y-3">
          <p className="text-sm font-medium text-gray-700">Deixe a sua opiniao</p>
          <StarRating value={estrelas} onChange={setEstrelas} />
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Como foi a sua experiencia?"
            required
          />
          <Button type="submit" disabled={enviando} className="text-sm">
            {enviando ? 'A enviar...' : 'Enviar feedback'}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          <Link href="/cliente/login" className="text-primary hover:underline">
            Inicie sessao
          </Link>
          {' '}como cliente para deixar o seu feedback.
        </p>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">A carregar opinioes...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-500 text-sm">Ainda sem feedbacks. Seja o primeiro a avaliar!</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="font-medium text-sm text-gray-900">{fb.usuarioNome}</span>
                <div className="flex items-center gap-2">
                  {renderStars(fb.estrelas, 'sm')}
                  <span className="text-xs text-gray-400">{formatDate(fb.criadoEm)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{fb.comentario}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
