'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button } from '@/components';
import { useToast } from '@/context/ToastContext';
import { reservaAdminService } from '@/services';
import type { Reserva, StatusReserva } from '@/types';

type Filtro = StatusReserva | 'TODOS';

const statusBadge: Record<StatusReserva, 'warning' | 'success' | 'danger' | 'info'> = {
  PENDENTE: 'warning',
  CONFIRMADA: 'success',
  CANCELADA: 'danger',
  REJEITADA: 'danger',
};

const pagamentoBadge: Record<string, 'warning' | 'success' | 'info'> = {
  NAO_PAGO: 'warning',
  PARCIAL: 'info',
  PAGO: 'success',
};

const filtros: { key: Filtro; label: string }[] = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'CONFIRMADA', label: 'Confirmadas' },
  { key: 'CANCELADA', label: 'Canceladas' },
  { key: 'REJEITADA', label: 'Rejeitadas' },
  { key: 'TODOS', label: 'Todas' },
];

export function AdminReservasPage() {
  const { showToast } = useToast();
  const [filtro, setFiltro] = useState<Filtro>('PENDENTE');
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [acaoId, setAcaoId] = useState<number | null>(null);
  const [totalPendentes, setTotalPendentes] = useState(0);

  const carregarContagem = useCallback(async () => {
    try {
      const pendentes = await reservaAdminService.listar('PENDENTE');
      setTotalPendentes(pendentes.length);
    } catch {
      setTotalPendentes(0);
    }
  }, []);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const data = await reservaAdminService.listar(filtro === 'TODOS' ? undefined : filtro);
      setReservas(data);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
    carregarContagem();
  }, [carregar, carregarContagem]);

  async function executar(acao: (id: number) => Promise<Reserva>, id: number) {
    setAcaoId(id);
    try {
      await acao(id);
      await carregar();
      await carregarContagem();
      showToast('Operacao concluida.', 'success');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro na operacao');
      showToast(err instanceof Error ? err.message : 'Erro na operacao', 'error');
    } finally {
      setAcaoId(null);
    }
  }

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  const pendentes = totalPendentes;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Gestao de Reservas</h2>
        <p className="text-slate-400">Confirmar, rejeitar ou cancelar pedidos de viagem</p>
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
              <span className="ml-1.5 bg-amber-400 text-gray-900 text-xs px-1.5 py-0.5 rounded-full">
                {pendentes}
              </span>
            )}
          </button>
        ))}
      </div>

      {erro && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{erro}</div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Reservas ({reservas.length})</h3>
        {loading ? (
          <p className="text-slate-400 text-center py-8">A carregar...</p>
        ) : reservas.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Nenhuma reserva encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600 text-left text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Cliente</th>
                  <th className="pb-3 pr-4 font-medium">Destino</th>
                  <th className="pb-3 pr-4 font-medium">Data</th>
                  <th className="pb-3 pr-4 font-medium">Dias</th>
                  <th className="pb-3 pr-4 font-medium">Pessoas</th>
                  <th className="pb-3 pr-4 font-medium">Guia</th>
                  <th className="pb-3 pr-4 font-medium">Preco est.</th>
                  <th className="pb-3 pr-4 font-medium">Pagamento</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id} className="border-b border-slate-700 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-white">{r.usuarioNome}</div>
                      <div className="text-slate-500 text-xs">{r.usuarioEmail}</div>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      <div>{r.destinoNome}</div>
                      <div className="text-xs text-slate-500">{r.destinoCidade}</div>
                    </td>
                    <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">{formatDate(r.dataInicio)}</td>
                    <td className="py-3 pr-4 text-slate-300">{r.numeroDias}</td>
                    <td className="py-3 pr-4 text-slate-300">{r.numeroPessoas}</td>
                    <td className="py-3 pr-4 text-slate-300">{r.guiaNome || '-'}</td>
                    <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">{formatMoney(r.precoEstimado)}</td>
                    <td className="py-3 pr-4">
                      {r.status === 'CONFIRMADA' ? (
                        <div className="space-y-1">
                          <Badge variant={pagamentoBadge[r.statusPagamento || 'NAO_PAGO']}>
                            {r.statusPagamento || 'NAO_PAGO'}
                          </Badge>
                          {r.valorPago != null && r.valorPago > 0 && (
                            <div className="text-xs text-slate-500">{formatMoney(r.valorPago)} pago</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusBadge[r.status]}>{r.status}</Badge>
                    </td>
                    <td className="py-3">
                      {r.status === 'PENDENTE' ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="accent"
                            className="text-xs px-3 py-1"
                            disabled={acaoId === r.id}
                            onClick={() => executar(reservaAdminService.confirmar, r.id)}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="danger"
                            className="text-xs px-3 py-1"
                            disabled={acaoId === r.id}
                            onClick={() => executar(reservaAdminService.rejeitar, r.id)}
                          >
                            Rejeitar
                          </Button>
                        </div>
                      ) : r.status === 'CONFIRMADA' ? (
                        <Button
                          variant="secondary"
                          className="text-xs px-3 py-1"
                          disabled={acaoId === r.id}
                          onClick={() => executar(reservaAdminService.cancelar, r.id)}
                        >
                          Cancelar
                        </Button>
                      ) : (
                        <span className="text-slate-500 text-xs">Sem acoes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
