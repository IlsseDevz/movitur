'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button } from '@/components';
import { useToast } from '@/context/ToastContext';
import { pagamentoAdminService, relatorioAdminService } from '@/services';
import type { Pagamento, RelatorioResumo, StatusVerificacaoPagamento } from '@/types';

type Filtro = StatusVerificacaoPagamento | 'TODOS';

const metodoLabel: Record<string, string> = {
  MPESA: 'M-Pesa',
  TRANSFERENCIA: 'Transferencia',
  POUPANCA: 'Poupanca',
};

const statusBadge: Record<StatusVerificacaoPagamento, 'warning' | 'success' | 'danger'> = {
  PENDENTE: 'warning',
  CONFIRMADO: 'success',
  REJEITADO: 'danger',
};

const filtros: { key: Filtro; label: string }[] = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'CONFIRMADO', label: 'Confirmados' },
  { key: 'REJEITADO', label: 'Rejeitados' },
  { key: 'TODOS', label: 'Todos' },
];

export function AdminPagamentosPage() {
  const { showToast } = useToast();
  const [filtro, setFiltro] = useState<Filtro>('PENDENTE');
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [acaoId, setAcaoId] = useState<number | null>(null);
  const [rejeitarId, setRejeitarId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState('');
  const [resumo, setResumo] = useState<RelatorioResumo | null>(null);

  const carregarResumo = useCallback(async () => {
    try {
      setResumo(await relatorioAdminService.resumo());
    } catch {
      setResumo(null);
    }
  }, []);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      setPagamentos(await pagamentoAdminService.listar(filtro === 'TODOS' ? undefined : filtro));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
    carregarResumo();
  }, [carregar, carregarResumo]);

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  const formatDateTime = (d?: string) =>
    d ? new Date(d).toLocaleString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

  const confirmados = pagamentos.filter((p) => p.statusVerificacao === 'CONFIRMADO');
  const totalConfirmadoFiltro = confirmados.reduce((s, p) => s + p.valor, 0);
  const pendentes = resumo?.pagamentosPendentes ?? pagamentos.filter((p) => p.statusVerificacao === 'PENDENTE').length;

  async function confirmar(id: number) {
    setAcaoId(id);
    try {
      await pagamentoAdminService.confirmar(id);
      await carregar();
      await carregarResumo();
      showToast('Pagamento confirmado.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao confirmar', 'error');
    } finally {
      setAcaoId(null);
    }
  }

  async function rejeitar(e: React.FormEvent) {
    e.preventDefault();
    if (!rejeitarId) return;
    setAcaoId(rejeitarId);
    try {
      await pagamentoAdminService.rejeitar(rejeitarId, motivo || undefined);
      setRejeitarId(null);
      setMotivo('');
      await carregar();
      await carregarResumo();
      showToast('Pagamento rejeitado.', 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao rejeitar', 'error');
    } finally {
      setAcaoId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Verificacao de Pagamentos</h2>
        <p className="text-slate-400">Confirme M-Pesa e transferencias antes de actualizar a reserva</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltro(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === f.key
                ? 'bg-slate-600 text-white'
                : 'bg-slate-800 border border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {f.label}
            {f.key === 'PENDENTE' && pendentes > 0 && filtro !== 'PENDENTE' && (
              <span className="ml-1.5 bg-amber-400 text-gray-900 text-xs px-1.5 py-0.5 rounded-full">{pendentes}</span>
            )}
          </button>
        ))}
      </div>

      {erro && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{erro}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Receita confirmada (total)</p>
          <p className="text-2xl font-bold text-white mt-1">{formatMoney(resumo?.receitaConfirmada ?? totalConfirmadoFiltro)}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <p className="text-slate-400 text-sm">Registos (filtro actual)</p>
          <p className="text-2xl font-bold text-white mt-1">{pagamentos.length}</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Pagamentos ({pagamentos.length})</h3>
        {loading ? (
          <p className="text-slate-400 text-center py-8">A carregar...</p>
        ) : pagamentos.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Nenhum pagamento encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600 text-left text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Data</th>
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Destino</th>
                  <th className="pb-3 pr-4 font-medium">Valor</th>
                  <th className="pb-3 pr-4 font-medium">Metodo</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 pr-4 font-medium">Referencia</th>
                  <th className="pb-3 font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {pagamentos.map((p) => (
                  <tr key={p.id} className="border-b border-slate-700 last:border-0">
                    <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">{formatDateTime(p.criadoEm)}</td>
                    <td className="py-3 pr-4">
                      <div className="font-medium text-white">{p.usuarioNome}</div>
                      <div className="text-xs text-slate-500">{p.usuarioEmail}</div>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{p.destinoNome}</td>
                    <td className="py-3 pr-4 text-slate-300 whitespace-nowrap font-medium">{formatMoney(p.valor)}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={p.metodo === 'POUPANCA' ? 'info' : 'success'}>
                        {metodoLabel[p.metodo] || p.metodo}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusBadge[p.statusVerificacao || 'PENDENTE']}>
                        {p.statusVerificacao || 'PENDENTE'}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 text-xs">
                      {p.metodo === 'POUPANCA'
                        ? p.metaPoupancaTitulo || `Meta #${p.metaPoupancaId}`
                        : p.referencia || '-'}
                      {p.motivoRejeicao && (
                        <div className="text-red-400 mt-1">{p.motivoRejeicao}</div>
                      )}
                    </td>
                    <td className="py-3">
                      {p.statusVerificacao === 'PENDENTE' && p.metodo !== 'POUPANCA' ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="accent"
                            className="text-xs px-3 py-1"
                            disabled={acaoId === p.id}
                            onClick={() => confirmar(p.id)}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="danger"
                            className="text-xs px-3 py-1"
                            disabled={acaoId === p.id}
                            onClick={() => setRejeitarId(p.id)}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {rejeitarId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setRejeitarId(null)}>
          <div className="bg-slate-800 border border-slate-600 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Rejeitar pagamento</h3>
            <form onSubmit={rejeitar} className="space-y-4">
              <div>
                <label className="text-sm text-slate-400">Motivo (opcional)</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  rows={3}
                  placeholder="Ex: Referencia invalida ou valor incorrecto"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="danger" disabled={acaoId === rejeitarId}>Rejeitar</Button>
                <Button type="button" variant="secondary" onClick={() => setRejeitarId(null)}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
