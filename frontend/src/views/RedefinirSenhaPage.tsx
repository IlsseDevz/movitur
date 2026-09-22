'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Card, Input } from '@/components';
import { authService } from '@/services';

export function RedefinirSenhaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    if (novaSenha !== confirmar) {
      setErro('As senhas nao coincidem.');
      return;
    }
    if (!token) {
      setErro('Link invalido. Solicite um novo link de recuperacao.');
      return;
    }
    setLoading(true);
    try {
      await authService.redefinirSenha(token, novaSenha);
      router.replace('/cliente/login');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Nova Senha">
        <p className="text-gray-600 text-sm mb-6">Escolha uma nova senha para a sua conta.</p>

        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            minLength={6}
            required
          />
          <Input
            label="Confirmar senha"
            type="password"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            minLength={6}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'A guardar...' : 'Redefinir senha'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/cliente/login" className="text-primary font-medium hover:underline">
            Voltar ao login
          </Link>
        </p>
      </Card>
    </div>
  );
}
