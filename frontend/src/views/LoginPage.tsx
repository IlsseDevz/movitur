'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { consumeNavState, setNavState } from '@/lib/nav-state';

export function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const navState = consumeNavState<{ from?: string; reservaPrefill?: { destinoId: number; numeroDias?: number } }>() || {};
  const from = navState.from || '/cliente/inicio';
  const reservaPrefill = navState.reservaPrefill;

  const authMessage = reservaPrefill
    ? 'Inicie sessao para concluir a sua reserva.'
    : from === '/cliente/simulador'
      ? 'Inicie sessao para simular o orcamento da sua viagem.'
      : from === '/cliente/reservas'
        ? 'Inicie sessao para gerir as suas reservas.'
        : from === '/cliente/poupancas'
          ? 'Inicie sessao para aceder as suas poupancas.'
          : null;

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const response = await login({ email, senha });
      if (response.role === 'ADMIN') {
        router.replace('/admin');
      } else {
        const dest = reservaPrefill ? '/cliente/reservas' : (from.startsWith('/cliente') ? from : '/cliente/inicio');
        if (reservaPrefill) {
          setNavState({ reservaPrefill });
        }
        router.replace(dest);
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao iniciar sessao');
    } finally {
      setLoading(false);
    }
  }

  function irRegisto() {
    setNavState({ from, reservaPrefill });
    router.push('/cliente/registo');
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Iniciar Sessao">
        {authMessage && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm">
            {authMessage}
          </div>
        )}
        <p className="text-gray-600 text-sm mb-6">
          Pode explorar destinos e guias sem conta. O login e necessario para reservas, simulador e poupancas.
        </p>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            id="senha"
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </Button>
          <p className="text-right">
            <Link href="/cliente/recuperar-senha" className="text-sm text-primary hover:underline">
              Esqueci a senha
            </Link>
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ainda nao tem conta?{' '}
          <button type="button" onClick={irRegisto} className="text-primary font-medium hover:underline">
            Criar conta
          </button>
          <span className="mx-2">|</span>
          <Link href="/admin/login" className="text-gray-400 hover:underline">
            Acesso admin
          </Link>
        </p>
      </Card>
    </div>
  );
}
