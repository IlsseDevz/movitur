'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button, Card, Input } from '@/components';
import { authService } from '@/services';

export function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setLoading(true);
    try {
      const msg = await authService.recuperarSenha(email);
      setMensagem(msg);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao enviar pedido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card title="Recuperar Senha">
        <p className="text-gray-600 text-sm mb-6">
          Introduza o email da sua conta. Se existir, recebera um link para redefinir a senha.
        </p>

        {mensagem && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {mensagem}
          </div>
        )}
        {erro && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'A enviar...' : 'Enviar link'}
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
