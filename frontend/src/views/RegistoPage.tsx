'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { consumeNavState, setNavState } from '@/lib/nav-state';

export function RegistoPage() {
  const { registar } = useAuth();
  const router = useRouter();
  const navState = consumeNavState<{ from?: string; reservaPrefill?: { destinoId: number; numeroDias?: number } }>() || {};
  const from = navState.from;
  const reservaPrefill = navState.reservaPrefill;

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (senha !== confirmarSenha) {
      setErro('As senhas nao coincidem.');
      return;
    }

    setLoading(true);
    try {
      await registar({ nomeCompleto, email, senha, telefone: telefone || undefined });
      setSucesso('Registo efetuado! Aguarde a aprovacao do administrador. Sera notificado por email.');
      setTimeout(() => {
        setNavState({ from, reservaPrefill });
        router.push('/cliente/login');
      }, 3000);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Criar Conta">
        {erro && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{erro}</div>}
        {sucesso && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{sucesso}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input id="nome" label="Nome completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required />
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="telefone" label="Telefone (opcional)" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
          <Input id="senha" label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} />
          <Input id="confirmar" label="Confirmar senha" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'A registar...' : 'Registar'}</Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Ja tem conta? <Link href="/cliente/login" className="text-primary font-medium hover:underline">Iniciar sessao</Link>
        </p>
      </Card>
    </div>
  );
}
