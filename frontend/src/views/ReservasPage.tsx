'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Card, Select, Input, Button, Badge } from '@/components';
import { consumeNavState } from '@/lib/nav-state';
import { useToast } from '@/context/ToastContext';
import { reservaService, destinoService, guiaService, avaliacaoService, pagamentoService, poupancaService } from '@/services';
import type { Reserva, ReservaRequest, Destino, GuiaTuristico, StatusReserva, MetodoPagamento, MetaPoupanca, Pagamento } from '@/types';

const emptyForm: ReservaRequest = {
  destinoId: 0,
  guiaId: undefined,
  dataInicio: '',
  numeroDias: 3,
  numeroPessoas: 1,
  observacoes: '',
};

const pagamentoBadge: Record<string, 'warning' | 'success' | 'info'> = {
  NAO_PAGO: 'warning',
  PARCIAL: 'info',
  PAGO: 'success',
};

const verificacaoBadge: Record<string, 'warning' | 'success' | 'danger'> = {
  PENDENTE: 'warning',
  CONFIRMADO: 'success',
  REJEITADO: 'danger',
};

const metodoLabel: Record<string, string> = {
  MPESA: 'M-Pesa',
  TRANSFERENCIA: 'Transferencia',
  POUPANCA: 'Poupanca',
};

const statusBadge: Record<StatusReserva, 'warning' | 'success' | 'danger' | 'info'> = {
  PENDENTE: 'warning',
  CONFIRMADA: 'success',
  CANCELADA: 'danger',
  REJEITADA: 'danger',
};

export function ReservasPage() {
  const { showToast } = useToast();
  const prefill = consumeNavState<{ destinoId?: number; numeroDias?: number; reservaPrefill?: { destinoId?: number; numeroDias?: number } }>();
  const prefillData = prefill?.reservaPrefill || prefill;
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [guias, setGuias] = useState<GuiaTuristico[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [form, setForm] = useState<ReservaRequest>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avaliarReserva, setAvaliarReserva] = useState<Reserva | null>(null);
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviandoAvaliacao, setEnviandoAvaliacao] = useState(false);
  const [pagarReserva, setPagarReserva] = useState<Reserva | null>(null);
  const [metas, setMetas] = useState<MetaPoupanca[]>([]);
  const [metodo, setMetodo] = useState<MetodoPagamento>('MPESA');
  const [valorPagamento, setValorPagamento] = useState('');
  const [referencia, setReferencia] = useState('');
  const [metaPoupancaId, setMetaPoupancaId] = useState<number | ''>('');
  const [enviandoPagamento, setEnviandoPagamento] = useState(false);
  const [historicoReserva, setHistoricoReserva] = useState<Reserva | null>(null);
  const [historicoPagamentos, setHistoricoPagamentos] = useState<Pagamento[]>([]);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const loadReservas = () =>
    reservaService.listarMinhas().then(setReservas).catch((e) => setError(e.message));

  useEffect(() => {
    destinoService.listar().then((d) => setDestinos(d.filter((x) => x.ativo))).catch(console.error);
    loadReservas();
  }, []);

  useEffect(() => {
    if (prefillData?.destinoId) {
      setForm((f) => ({
        ...f,
        destinoId: prefillData.destinoId!,
        numeroDias: prefillData.numeroDias || f.numeroDias,
      }));
    }
  }, [prefillData]);

  useEffect(() => {
    if (form.destinoId) {
      guiaService.listar({ ativo: true, destinoId: form.destinoId }).then(setGuias).catch(console.error);
    } else {
      setGuias([]);
    }
  }, [form.destinoId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data: ReservaRequest = {
        ...form,
        destinoId: Number(form.destinoId),
        guiaId: form.guiaId || undefined,
        observacoes: form.observacoes || undefined,
      };
      await reservaService.criar(data);
      setForm(emptyForm);
      loadReservas();
      showToast('Reserva enviada com sucesso!', 'success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id: number) => {
    if (!confirm('Cancelar esta reserva?')) return;
    try {
      await reservaService.cancelar(id);
      loadReservas();
      showToast('Reserva cancelada.', 'info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar');
    }
  };

  async function enviarAvaliacao(e: FormEvent) {
    e.preventDefault();
    if (!avaliarReserva) return;
    setEnviandoAvaliacao(true);
    try {
      await avaliacaoService.criar({
        reservaId: avaliarReserva.id,
        nota,
        comentario: comentario || undefined,
      });
      setAvaliarReserva(null);
      setComentario('');
      setNota(5);
      loadReservas();
      showToast('Avaliacao enviada. Obrigado!', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao avaliar', 'error');
    } finally {
      setEnviandoAvaliacao(false);
    }
  }

  async function abrirHistorico(r: Reserva) {
    setHistoricoReserva(r);
    setHistoricoPagamentos([]);
    setLoadingHistorico(true);
    try {
      setHistoricoPagamentos(await pagamentoService.listarPorReserva(r.id));
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao carregar pagamentos', 'error');
    } finally {
      setLoadingHistorico(false);
    }
  }

  async function abrirPagamento(r: Reserva) {
    setPagarReserva(r);
    setMetodo('MPESA');
    setValorPagamento(String(r.valorRestante ?? r.precoEstimado ?? ''));
    setReferencia('');
    setMetaPoupancaId('');
    try {
      const lista = await poupancaService.listar();
      setMetas(lista.filter((m) => m.ativa && m.valorAcumulado > 0));
    } catch {
      setMetas([]);
    }
  }

  async function enviarPagamento(e: FormEvent) {
    e.preventDefault();
    if (!pagarReserva) return;
    setEnviandoPagamento(true);
    try {
      await pagamentoService.pagar({
        reservaId: pagarReserva.id,
        valor: Number(valorPagamento),
        metodo,
        referencia: metodo !== 'POUPANCA' ? referencia : undefined,
        metaPoupancaId: metodo === 'POUPANCA' && metaPoupancaId ? Number(metaPoupancaId) : undefined,
      });
      setPagarReserva(null);
      loadReservas();
      showToast(
        metodo === 'POUPANCA'
          ? 'Pagamento confirmado com saldo da poupanca!'
          : 'Pagamento submetido. Aguarda verificacao do admin.',
        'success',
      );
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao pagar', 'error');
    } finally {
      setEnviandoPagamento(false);
    }
  }

  const podePagar = (r: Reserva) =>
    r.status === 'CONFIRMADA' && r.statusPagamento !== 'PAGO' && (r.valorRestante ?? r.precoEstimado ?? 0) > 0;

  const formatDate = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  const formatDateTime = (d?: string) =>
    d ? new Date(d).toLocaleString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

  const destinoSel = destinos.find((d) => d.id === Number(form.destinoId));
  const precoPreview = destinoSel?.precoMedioEstimado
    ? destinoSel.precoMedioEstimado * form.numeroDias * form.numeroPessoas
    : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-dark">Minhas Reservas</h2>
        <p className="text-gray-500">Reserve a sua viagem e acompanhe o estado do pedido</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <Card title="Nova Reserva" className="mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Destino *"
            options={[{ value: 0, label: 'Selecione...' }, ...destinos.map((d) => ({ value: d.id, label: `${d.nome} - ${d.cidade}` }))]}
            value={form.destinoId}
            onChange={(e) => setForm({ ...form, destinoId: Number(e.target.value), guiaId: undefined })}
            required
          />
          <Select
            label="Guia (opcional)"
            options={[{ value: '', label: 'Sem guia preferido' }, ...guias.map((g) => ({ value: g.id, label: g.nome }))]}
            value={form.guiaId ?? ''}
            onChange={(e) => setForm({ ...form, guiaId: e.target.value ? Number(e.target.value) : undefined })}
            disabled={!form.destinoId}
          />
          <Input
            label="Data de inicio *"
            type="date"
            value={form.dataInicio}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
            required
          />
          <Input
            label="Numero de dias *"
            type="number"
            min="1"
            value={form.numeroDias}
            onChange={(e) => setForm({ ...form, numeroDias: Number(e.target.value) })}
            required
          />
          <Input
            label="Numero de pessoas *"
            type="number"
            min="1"
            value={form.numeroPessoas}
            onChange={(e) => setForm({ ...form, numeroPessoas: Number(e.target.value) })}
            required
          />
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Observacoes</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={2}
              placeholder="Pedidos especiais, alergias, etc."
            />
          </div>
          <div className="md:col-span-2">
            {precoPreview != null && form.destinoId > 0 && (
              <p className="text-sm text-gray-600 mb-3">
                Preco estimado: <strong className="text-primary">{formatMoney(precoPreview)}</strong>
              </p>
            )}
            <Button type="submit" disabled={loading}>{loading ? 'A enviar...' : 'Pedir Reserva'}</Button>
          </div>
        </form>
      </Card>

      <Card title={`Historico (${reservas.length})`}>
        {reservas.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Ainda nao tem reservas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="py-3 px-2">Destino</th>
                  <th className="py-3 px-2">Data</th>
                  <th className="py-3 px-2">Dias</th>
                  <th className="py-3 px-2">Pessoas</th>
                  <th className="py-3 px-2">Guia</th>
                  <th className="py-3 px-2">Estado</th>
                  <th className="py-3 px-2">Pagamento</th>
                  <th className="py-3 px-2">Preco est.</th>
                  <th className="py-3 px-2">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r) => (
                  <tr key={r.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium">{r.destinoNome}</div>
                      <div className="text-xs text-gray-500">{r.destinoCidade}</div>
                    </td>
                    <td className="py-3 px-2">{formatDate(r.dataInicio)}</td>
                    <td className="py-3 px-2">{r.numeroDias}</td>
                    <td className="py-3 px-2">{r.numeroPessoas}</td>
                    <td className="py-3 px-2">{r.guiaNome || '-'}</td>
                    <td className="py-3 px-2">
                      <Badge variant={statusBadge[r.status]}>{r.status}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      {r.status === 'CONFIRMADA' ? (
                        <div className="space-y-1">
                          <Badge variant={pagamentoBadge[r.statusPagamento || 'NAO_PAGO']}>
                            {r.statusPagamento || 'NAO_PAGO'}
                          </Badge>
                          {r.valorPago != null && r.valorPago > 0 && (
                            <div className="text-xs text-gray-500">Pago: {formatMoney(r.valorPago)}</div>
                          )}
                          {(r.valorRestante ?? 0) > 0 && (
                            <div className="text-xs text-amber-600">Resta: {formatMoney(r.valorRestante)}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">{formatMoney(r.precoEstimado)}</td>
                    <td className="py-3 px-2">
                      <div className="flex flex-wrap gap-1">
                        {r.status === 'PENDENTE' && (
                          <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleCancelar(r.id)}>
                            Cancelar
                          </Button>
                        )}
                        {r.podeAvaliar && (
                          <Button variant="accent" className="text-xs px-2 py-1" onClick={() => setAvaliarReserva(r)}>
                            Avaliar guia
                          </Button>
                        )}
                        {r.status === 'CONFIRMADA' && (
                          <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => abrirHistorico(r)}>
                            Pagamentos
                          </Button>
                        )}
                        {podePagar(r) && (
                          <Button variant="accent" className="text-xs px-2 py-1" onClick={() => abrirPagamento(r)}>
                            Pagar
                          </Button>
                        )}
                        {r.avaliada && (
                          <span className="text-xs text-green-600">Avaliada</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {historicoReserva && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setHistoricoReserva(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary-dark mb-1">Historico de pagamentos</h3>
            <p className="text-sm text-gray-500 mb-4">{historicoReserva.destinoNome}</p>
            {loadingHistorico ? (
              <p className="text-gray-500 text-center py-6">A carregar...</p>
            ) : historicoPagamentos.length === 0 ? (
              <p className="text-gray-500 text-center py-6">Ainda nao submeteu nenhum pagamento.</p>
            ) : (
              <div className="space-y-3">
                {historicoPagamentos.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{formatMoney(p.valor)}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(p.criadoEm)}</p>
                      </div>
                      <Badge variant={verificacaoBadge[p.statusVerificacao || 'PENDENTE']}>
                        {p.statusVerificacao || 'PENDENTE'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{metodoLabel[p.metodo] || p.metodo}</p>
                    {p.metodo === 'POUPANCA' ? (
                      <p className="text-xs text-gray-500 mt-1">{p.metaPoupancaTitulo || `Meta #${p.metaPoupancaId}`}</p>
                    ) : p.referencia ? (
                      <p className="text-xs text-gray-500 mt-1">Ref: {p.referencia}</p>
                    ) : null}
                    {p.motivoRejeicao && (
                      <p className="text-xs text-red-600 mt-2">Motivo: {p.motivoRejeicao}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              {podePagar(historicoReserva) && (
                <Button variant="accent" onClick={() => { setHistoricoReserva(null); abrirPagamento(historicoReserva); }}>
                  Novo pagamento
                </Button>
              )}
              <Button variant="secondary" onClick={() => setHistoricoReserva(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      {pagarReserva && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setPagarReserva(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary-dark mb-1">Pagar reserva</h3>
            <p className="text-sm text-gray-500 mb-1">{pagarReserva.destinoNome}</p>
            <p className="text-sm text-gray-600 mb-4">
              Total: {formatMoney(pagarReserva.precoEstimado)} · Restante: {formatMoney(pagarReserva.valorRestante)}
            </p>
            <form onSubmit={enviarPagamento} className="space-y-4">
              <Select
                label="Metodo *"
                options={[
                  { value: 'MPESA', label: 'M-Pesa' },
                  { value: 'TRANSFERENCIA', label: 'Transferencia bancaria' },
                  { value: 'POUPANCA', label: 'Saldo da poupanca' },
                ]}
                value={metodo}
                onChange={(e) => setMetodo(e.target.value as MetodoPagamento)}
              />
              <Input
                label="Valor (MZN) *"
                type="number"
                min="1"
                max={pagarReserva.valorRestante ?? pagarReserva.precoEstimado}
                value={valorPagamento}
                onChange={(e) => setValorPagamento(e.target.value)}
                required
              />
              {metodo !== 'POUPANCA' ? (
                <Input
                  label="Referencia / comprovativo *"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ex: codigo M-Pesa ou n. transferencia"
                  required
                />
              ) : (
                <Select
                  label="Meta de poupanca *"
                  options={[
                    { value: '', label: metas.length ? 'Selecione...' : 'Nenhuma meta com saldo' },
                    ...metas.map((m) => ({
                      value: m.id,
                      label: `${m.titulo} (${formatMoney(m.valorAcumulado)} disponivel)`,
                    })),
                  ]}
                  value={metaPoupancaId}
                  onChange={(e) => setMetaPoupancaId(e.target.value ? Number(e.target.value) : '')}
                  required
                />
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={enviandoPagamento || (metodo === 'POUPANCA' && !metaPoupancaId)}>
                  {enviandoPagamento ? 'A processar...' : 'Confirmar pagamento'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setPagarReserva(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {avaliarReserva && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAvaliarReserva(null)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-primary-dark mb-1">Avaliar {avaliarReserva.guiaNome}</h3>
            <p className="text-sm text-gray-500 mb-4">Reserva: {avaliarReserva.destinoNome}</p>
            <form onSubmit={enviarAvaliacao} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nota (1-5)</label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={nota}
                  onChange={(e) => setNota(Number(e.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>{n} {'★'.repeat(n)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Comentario (opcional)</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  rows={3}
                  placeholder="Como foi a experiencia?"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={enviandoAvaliacao}>
                  {enviandoAvaliacao ? 'A enviar...' : 'Enviar avaliacao'}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setAvaliarReserva(null)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
