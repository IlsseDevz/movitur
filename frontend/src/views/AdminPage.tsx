'use client';

import { useCallback, useEffect, useState } from 'react';
import { Badge, Button } from '@/components';
import { useToast } from '@/context/ToastContext';
import { adminService } from '@/services';
import type { StatusConta, Usuario } from '@/types';

type Filtro = StatusConta | 'TODOS';

const statusBadge: Record<StatusConta, 'warning' | 'success' | 'danger'> = {
  PENDENTE: 'warning',
  APROVADO: 'success',
  REJEITADO: 'danger',
};

const filtros: { key: Filtro; label: string }[] = [
  { key: 'PENDENTE', label: 'Pendentes' },
  { key: 'APROVADO', label: 'Aprovados' },
  { key: 'REJEITADO', label: 'Rejeitados' },
  { key: 'TODOS', label: 'Todos' },
];

export function AdminPage() {
  const { showToast } = useToast();
  const [filtro, setFiltro] = useState<Filtro>('PENDENTE');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [acaoId, setAcaoId] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErro('');
    try {
      const data = await adminService.listarUsuarios(filtro === 'TODOS' ? undefined : filtro);
      setUsuarios(data.filter((u) => u.role === 'CLIENTE'));
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function aprovar(id: number) {
    setAcaoId(id);
    try {
      await adminService.aprovar(id);
      showToast('Cliente aprovado com sucesso.', 'success');
      await carregar();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao aprovar', 'error');
    } finally {
      setAcaoId(null);
    }
  }

  async function rejeitar(id: number) {
    const motivo = window.prompt('Motivo da rejeicao (opcional):') || undefined;
    setAcaoId(id);
    try {
      await adminService.rejeitar(id, motivo);
      showToast('Registo rejeitado.', 'info');
      await carregar();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao rejeitar', 'error');
    } finally {
      setAcaoId(null);
    }
  }

  const pendentes = usuarios.filter((u) => u.status === 'PENDENTE').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Utilizadores</h2>
        <p className="text-slate-400">Aprovar ou rejeitar registos de clientes</p>
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
              <span className="ml-1.5 bg-amber-500 text-gray-900 text-xs px-1.5 py-0.5 rounded-full">
                {pendentes}
              </span>
            )}
          </button>
        ))}
      </div>

      {erro && (
        <div className="p-3 bg-red-900/30 border border-red-700 text-red-300 rounded-lg text-sm">
          {erro}
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Clientes ({usuarios.length})</h3>
        {loading ? (
          <p className="text-slate-400 text-center py-8">A carregar...</p>
        ) : usuarios.length === 0 ? (
          <p className="text-slate-400 text-center py-8">Nenhum utilizador encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600 text-left text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Nome</th>
                  <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Email</th>
                  <th className="pb-3 pr-4 font-medium hidden md:table-cell">Telefone</th>
                  <th className="pb-3 pr-4 font-medium">Estado</th>
                  <th className="pb-3 font-medium">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-slate-700 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-white">{u.nomeCompleto}</div>
                      <div className="text-slate-500 sm:hidden text-xs">{u.email}</div>
                    </td>
                    <td className="py-3 pr-4 hidden sm:table-cell text-slate-300">{u.email}</td>
                    <td className="py-3 pr-4 hidden md:table-cell text-slate-300">{u.telefone || '-'}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={statusBadge[u.status]}>{u.status}</Badge>
                    </td>
                    <td className="py-3">
                      {u.status === 'PENDENTE' ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="accent"
                            className="text-xs px-3 py-1"
                            disabled={acaoId === u.id}
                            onClick={() => aprovar(u.id)}
                          >
                            Aprovar
                          </Button>
                          <Button
                            variant="danger"
                            className="text-xs px-3 py-1"
                            disabled={acaoId === u.id}
                            onClick={() => rejeitar(u.id)}
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
    </div>
  );
}
