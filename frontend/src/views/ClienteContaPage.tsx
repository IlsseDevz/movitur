'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Badge, Button, Card, Input } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { authService } from '@/services';
import type { StatusConta, Usuario } from '@/types';

const statusBadge: Record<StatusConta, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  APROVADO: { variant: 'success', label: 'Aprovado' },
  PENDENTE: { variant: 'warning', label: 'Pendente' },
  REJEITADO: { variant: 'danger', label: 'Rejeitado' },
};

export function ClienteContaPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [perfil, setPerfil] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  useEffect(() => {
    authService.me()
      .then((p) => { setPerfil(p); setTelefone(p.telefone || ''); })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar perfil'))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (v?: string) =>
    v ? new Date(v).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

  const estado = perfil ? statusBadge[perfil.status] : null;

  async function handlePerfil(e: FormEvent) {
    e.preventDefault();
    setSalvandoPerfil(true);
    try {
      const atualizado = await authService.atualizarPerfil(telefone || undefined);
      setPerfil(atualizado);
      showToast('Perfil atualizado com sucesso.', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao atualizar', 'error');
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function handleSenha(e: FormEvent) {
    e.preventDefault();
    setSalvandoSenha(true);
    try {
      const msg = await authService.alterarSenha(senhaAtual, novaSenha);
      setSenhaAtual('');
      setNovaSenha('');
      showToast(msg, 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao alterar senha', 'error');
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Minha Conta</h2>
        <p className="text-gray-500">Dados da sua conta de cliente</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

      <Card title="Informacoes pessoais">
        {loading ? (
          <p className="text-gray-500 text-center py-4">A carregar...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
            <div>
              <span className="text-gray-500">Nome completo</span>
              <p className="font-medium mt-1">{perfil?.nomeCompleto ?? user?.nomeCompleto}</p>
            </div>
            <div>
              <span className="text-gray-500">Email</span>
              <p className="font-medium mt-1">{perfil?.email ?? user?.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Tipo de conta</span>
              <p className="font-medium mt-1">{perfil?.role ?? user?.role}</p>
            </div>
            <div>
              <span className="text-gray-500">Estado</span>
              <div className="mt-1">
                {estado ? <Badge variant={estado.variant}>{estado.label}</Badge> : '-'}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Membro desde</span>
              <p className="font-medium mt-1">{formatDate(perfil?.criadoEm)}</p>
            </div>
          </div>
        )}

        <form onSubmit={handlePerfil} className="border-t pt-4 space-y-4">
          <h4 className="font-medium text-gray-700">Atualizar telefone</h4>
          <Input
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="+258 84 000 0000"
          />
          <Button type="submit" disabled={salvandoPerfil}>
            {salvandoPerfil ? 'A guardar...' : 'Guardar telefone'}
          </Button>
        </form>
      </Card>

      <Card title="Alterar senha">
        <form onSubmit={handleSenha} className="space-y-4 max-w-md">
          <Input
            label="Senha atual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            required
          />
          <Input
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            minLength={6}
            required
          />
          <Button type="submit" disabled={salvandoSenha}>
            {salvandoSenha ? 'A guardar...' : 'Alterar senha'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
