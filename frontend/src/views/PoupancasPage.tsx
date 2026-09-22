'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button, Card, Input, Select, Badge } from '@/components';
import { useToast } from '@/context/ToastContext';
import { poupancaService, destinoService } from '@/services';
import { consumeNavState } from '@/lib/nav-state';
import type { MetaPoupanca, MetaPoupancaRequest, Destino } from '@/types';

const emptyMeta: MetaPoupancaRequest = {
  titulo: '',
  valorMeta: 10000,
  destinoId: undefined,
  dataLimite: '',
};

export function PoupancasPage() {
  const { showToast } = useToast();
  const prefill = consumeNavState<{ titulo?: string; valorMeta?: number; destinoId?: number }>();

  const [metas, setMetas] = useState<MetaPoupanca[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [form, setForm] = useState<MetaPoupancaRequest>(emptyMeta);
  const [depositoMeta, setDepositoMeta] = useState<MetaPoupanca | null>(null);
  const [valorDeposito, setValorDeposito] = useState('');
  const [descDeposito, setDescDeposito] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => poupancaService.listar().then(setMetas).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    destinoService.listar({ ativo: true }).then(setDestinos).catch(console.error);
  }, []);

  useEffect(() => {
    if (prefill) {
      setForm((f) => ({
        ...f,
        titulo: prefill.titulo || f.titulo,
        valorMeta: prefill.valorMeta || f.valorMeta,
        destinoId: prefill.destinoId,
      }));
    }
  }, [prefill]);

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  async function handleCriar(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await poupancaService.criar({
        ...form,
        destinoId: form.destinoId || undefined,
        dataLimite: form.dataLimite || undefined,
      });
      setForm(emptyMeta);
      load();
      showToast('Meta de poupanca criada!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeposito(e: FormEvent) {
    e.preventDefault();
    if (!depositoMeta) return;
    setLoading(true);
    try {
      await poupancaService.depositar(depositoMeta.id, {
        valor: Number(valorDeposito),
        descricao: descDeposito || undefined,
      });
      setDepositoMeta(null);
      setValorDeposito('');
      setDescDeposito('');
      load();
      showToast('Deposito registado!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function encerrar(id: number) {
    if (!confirm('Encerrar esta meta de poupanca?')) return;
    await poupancaService.encerrar(id);
    load();
    showToast('Meta encerrada.', 'info');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Minhas Poupancas</h2>
        <p className="text-gray-500">Guarde dinheiro para a sua proxima viagem</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}

      <Card title="Nova meta de poupanca">
        <form onSubmit={handleCriar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Titulo *" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required placeholder="Ex: Viagem a Vilankulo" />
          <Input label="Valor objetivo (MZN) *" type="number" min="1" value={form.valorMeta} onChange={(e) => setForm({ ...form, valorMeta: Number(e.target.value) })} required />
          <Select
            label="Destino (opcional)"
            options={[{ value: '', label: 'Nenhum' }, ...destinos.map((d) => ({ value: d.id, label: d.nome }))]}
            value={form.destinoId ?? ''}
            onChange={(e) => setForm({ ...form, destinoId: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input label="Data limite (opcional)" type="date" value={form.dataLimite} onChange={(e) => setForm({ ...form, dataLimite: e.target.value })} />
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? 'A guardar...' : 'Criar meta'}</Button>
          </div>
        </form>
      </Card>

      <Card title={`Metas activas (${metas.filter((m) => m.ativa).length})`}>
        {metas.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Ainda nao tem metas de poupanca.</p>
        ) : (
          <div className="space-y-4">
            {metas.map((m) => (
              <div key={m.id} className="border rounded-xl p-4">
                <div className="flex flex-wrap justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-primary-dark">{m.titulo}</h3>
                    {m.destinoNome && <p className="text-sm text-gray-500">{m.destinoNome}</p>}
                  </div>
                  <Badge variant={m.ativa ? 'success' : 'info'}>{m.ativa ? 'Activa' : 'Encerrada'}</Badge>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>{formatMoney(m.valorAcumulado)} de {formatMoney(m.valorMeta)}</span>
                  <span className="font-medium text-primary">{m.percentual}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
                  <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${Math.min(100, m.percentual)}%` }} />
                </div>
                {m.ativa && (
                  <div className="flex gap-2">
                    <Button variant="accent" className="text-xs" onClick={() => setDepositoMeta(m)}>Depositar</Button>
                    <Button variant="secondary" className="text-xs" onClick={() => encerrar(m.id)}>Encerrar</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="text-sm text-gray-500">
        Use o saldo da poupanca para pagar reservas confirmadas em <Link href="/cliente/reservas" className="text-primary hover:underline">Minhas Reservas</Link>.
      </p>

      {depositoMeta && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDepositoMeta(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1">Depositar em {depositoMeta.titulo}</h3>
            <p className="text-sm text-gray-500 mb-4">Saldo actual: {formatMoney(depositoMeta.valorAcumulado)}</p>
            <form onSubmit={handleDeposito} className="space-y-4">
              <Input label="Valor (MZN) *" type="number" min="1" value={valorDeposito} onChange={(e) => setValorDeposito(e.target.value)} required />
              <Input label="Descricao (opcional)" value={descDeposito} onChange={(e) => setDescDeposito(e.target.value)} placeholder="Ex: Poupanca de Marco" />
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{loading ? 'A guardar...' : 'Depositar'}</Button>
                <Button type="button" variant="secondary" onClick={() => setDepositoMeta(null)}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
