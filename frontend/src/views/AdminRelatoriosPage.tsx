'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button, Card } from '@/components';
import { useToast } from '@/context/ToastContext';
import { relatorioAdminService } from '@/services';
import type { RelatorioResumo } from '@/types';

export function AdminRelatoriosPage() {
  const { showToast } = useToast();
  const [resumo, setResumo] = useState<RelatorioResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [exportando, setExportando] = useState<'reservas' | 'pagamentos' | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      setResumo(await relatorioAdminService.resumo());
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar relatorio');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  async function exportar(tipo: 'reservas' | 'pagamentos') {
    setExportando(tipo);
    try {
      if (tipo === 'reservas') {
        await relatorioAdminService.exportarReservas();
      } else {
        await relatorioAdminService.exportarPagamentos();
      }
      showToast('Ficheiro CSV descarregado.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao exportar', 'error');
    } finally {
      setExportando(null);
    }
  }

  const cards = resumo
    ? [
        { label: 'Receita confirmada', value: formatMoney(resumo.receitaConfirmada), color: 'text-emerald-400' },
        { label: 'Valor reservas confirmadas', value: formatMoney(resumo.valorReservasConfirmadas), color: 'text-sky-400' },
        { label: 'Clientes', value: String(resumo.totalClientes), color: 'text-violet-400' },
        { label: 'Pagamentos pendentes', value: String(resumo.pagamentosPendentes), color: 'text-amber-400' },
        { label: 'Reservas pendentes', value: String(resumo.reservasPendentes), color: 'text-amber-300' },
        { label: 'Reservas confirmadas', value: String(resumo.reservasConfirmadas), color: 'text-green-400' },
        { label: 'Reservas canceladas', value: String(resumo.reservasCanceladas), color: 'text-slate-400' },
        { label: 'Reservas rejeitadas', value: String(resumo.reservasRejeitadas), color: 'text-red-400' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Relatorios</h2>
        <p className="text-slate-400">Receita, reservas e exportacao de dados</p>
      </div>

      {erro && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{erro}</div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          variant="accent"
          disabled={exportando === 'reservas'}
          onClick={() => exportar('reservas')}
        >
          {exportando === 'reservas' ? 'A exportar...' : 'Exportar reservas (CSV)'}
        </Button>
        <Button
          variant="secondary"
          disabled={exportando === 'pagamentos'}
          onClick={() => exportar('pagamentos')}
        >
          {exportando === 'pagamentos' ? 'A exportar...' : 'Exportar pagamentos (CSV)'}
        </Button>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-8">A carregar...</p>
      ) : resumo && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <Card key={c.label} className="bg-slate-800 border-slate-700">
                <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
                <div className="text-slate-400 text-sm mt-1">{c.label}</div>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-800 border-slate-700 text-white">
            <h3 className="text-lg font-semibold text-white mb-4">Top destinos (por reservas)</h3>
            {resumo.topDestinos.length === 0 ? (
              <p className="text-slate-400 text-sm">Sem dados de reservas.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-600 text-left text-slate-400">
                      <th className="pb-2 pr-4">#</th>
                      <th className="pb-2 pr-4">Destino</th>
                      <th className="pb-2">Reservas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumo.topDestinos.map((d, i) => (
                      <tr key={d.destinoId} className="border-b border-slate-700 last:border-0">
                        <td className="py-2 pr-4 text-slate-500">{i + 1}</td>
                        <td className="py-2 pr-4 text-slate-200">{d.destinoNome}</td>
                        <td className="py-2 text-slate-300 font-medium">{d.totalReservas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
