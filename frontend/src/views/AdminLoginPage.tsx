'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { consumeNavState } from '@/lib/nav-state';

export function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const navState = consumeNavState<{ from?: string }>() || {};
  const from = navState.from || '/admin';

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
      if (response.role !== 'ADMIN') {
        setErro('Esta area e exclusiva para administradores.');
        return;
      }
      router.replace(from);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao iniciar sessao';
      setErro(msg.includes('indisponivel')
        ? `${msg} Aguarde ~1 minuto apos arrancar o backend.`
        : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title="Login Administrativo">
      {erro && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{erro}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input id="senha" label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'A entrar...' : 'Entrar'}</Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/" className="text-primary hover:underline">Voltar ao site</Link>
      </p>
    </Card>
  );
}
