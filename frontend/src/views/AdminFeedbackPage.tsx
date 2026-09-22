'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card } from '@/components';
import { renderStars } from '@/components/StarRating';
import { feedbackService } from '@/services';
import type { Feedback, FeedbackResumo } from '@/types';

function formatDate(iso?: string) {
  if (!iso) return '-';
  return new Date(iso).toLocaleString('pt-MZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [resumo, setResumo] = useState<FeedbackResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const [lista, resumoData] = await Promise.all([
        feedbackService.listarTodosAdmin(),
        feedbackService.resumoAdmin(),
      ]);
      setFeedbacks(lista);
      setResumo(resumoData);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar feedbacks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Feedbacks dos clientes</h2>
        <p className="text-slate-400">Acompanhe as opinioes e classificacoes enviadas pelos clientes.</p>
      </div>

      {resumo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 bg-slate-800 border-slate-700">
            <p className="text-sm text-slate-400">Total de feedbacks</p>
            <p className="text-3xl font-bold text-white mt-1">{resumo.total}</p>
          </Card>
          <Card className="p-5 bg-slate-800 border-slate-700">
            <p className="text-sm text-slate-400">Media de estrelas</p>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-3xl font-bold text-amber-400">{resumo.mediaEstrelas.toFixed(1)}</p>
              {renderStars(Math.round(resumo.mediaEstrelas), 'md')}
            </div>
          </Card>
        </div>
      )}

      {loading ? (
        <p className="text-slate-400">A carregar...</p>
      ) : erro ? (
        <p className="text-red-400">{erro}</p>
      ) : feedbacks.length === 0 ? (
        <Card className="p-6 bg-slate-800 border-slate-700 text-center text-slate-400">
          Nenhum feedback recebido ainda.
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-800 text-slate-300 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Estrelas</th>
                <th className="px-4 py-3">Comentario</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700 bg-slate-800/50">
              {feedbacks.map((fb) => (
                <tr key={fb.id} className="text-slate-200 hover:bg-slate-700/30">
                  <td className="px-4 py-3 whitespace-nowrap">{fb.usuarioNome}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{fb.tipoAlvo}</td>
                  <td className="px-4 py-3">{fb.entidadeNome}</td>
                  <td className="px-4 py-3">{renderStars(fb.estrelas)}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="line-clamp-3">{fb.comentario}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-400">{formatDate(fb.criadoEm)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
