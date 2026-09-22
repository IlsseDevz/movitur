'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Card, Input, Select } from '@/components';
import { EstabelecimentoCard } from '@/components/EstabelecimentoCard';
import { simuladorService, destinoService } from '@/services';
import { setNavState } from '@/lib/nav-state';
import type { SimuladorRequest, SimuladorResponse, Destino, TipoExperiencia } from '@/types';

const TIPOS = [
  { value: '', label: 'Todos' },
  { value: 'AVENTURA', label: 'Aventura' },
  { value: 'PRAIA', label: 'Praia' },
  { value: 'CULTURA', label: 'Cultura' },
  { value: 'LUXO', label: 'Luxo' },
  { value: 'FAMILIA', label: 'Familia' },
];

export function SimuladorPage() {
  const router = useRouter();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [simulacoes, setSimulacoes] = useState<SimuladorResponse[]>([]);
  const [resultado, setResultado] = useState<SimuladorResponse | null>(null);
  const [form, setForm] = useState<SimuladorRequest>({
    orcamento: 50000,
    numeroDias: 5,
    tipoExperiencia: undefined,
    destinoId: undefined,
    titulo: '',
    guardar: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    destinoService.listar().then(setDestinos).catch(console.error);
    loadSimulacoes();
  }, []);

  const loadSimulacoes = () =>
    simuladorService.listar().then(setSimulacoes).catch(console.error);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data: SimuladorRequest = {
        ...form,
        destinoId: form.destinoId || undefined,
        tipoExperiencia: form.tipoExperiencia || undefined,
      };
      const res = await simuladorService.calcular(data);
      setResultado(res);
      if (form.guardar) loadSimulacoes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover esta simulacao?')) return;
    await simuladorService.remover(id);
    loadSimulacoes();
  };

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  function irReservar(destinoId: number, numeroDias?: number) {
    setNavState({ reservaPrefill: { destinoId, numeroDias: numeroDias || form.numeroDias } });
    router.push('/cliente/reservas');
  }

  function criarMetaPoupanca(destinoId?: number, valorMeta?: number, titulo?: string) {
    setNavState({
      titulo: titulo || (resultado?.destinoNome ? `Poupanca: ${resultado.destinoNome}` : 'Meta de viagem'),
      valorMeta: valorMeta || form.orcamento,
      destinoId,
    });
    router.push('/cliente/poupancas');
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-dark">Simulador de Orcamento</h2>
        <p className="text-gray-500">Planeie a sua viagem de acordo com o orcamento e preferencias</p>
      </div>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

      <Card title="Calcular Viagem" className="mb-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Orcamento (MZN) *" type="number" min="1" value={form.orcamento} onChange={(e) => setForm({ ...form, orcamento: Number(e.target.value) })} required />
          <Input label="Numero de Dias *" type="number" min="1" value={form.numeroDias} onChange={(e) => setForm({ ...form, numeroDias: Number(e.target.value) })} required />
          <Select
            label="Tipo de Experiencia"
            options={TIPOS}
            value={form.tipoExperiencia || ''}
            onChange={(e) => setForm({ ...form, tipoExperiencia: (e.target.value || undefined) as TipoExperiencia | undefined })}
          />
          <Select
            label="Destino (opcional)"
            options={[{ value: '', label: 'Sugerir destinos' }, ...destinos.map((d) => ({ value: d.id, label: `${d.nome} - ${d.cidade}` }))]}
            value={form.destinoId || ''}
            onChange={(e) => setForm({ ...form, destinoId: e.target.value ? Number(e.target.value) : undefined })}
          />
          <Input label="Titulo da Simulacao" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          <label className="flex items-center gap-2 self-end">
            <input type="checkbox" checked={form.guardar} onChange={(e) => setForm({ ...form, guardar: e.target.checked })} />
            <span className="text-sm text-gray-600">Guardar simulacao</span>
          </label>
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>Calcular</Button>
          </div>
        </form>

        {resultado && (
          <div className={`mt-6 p-6 rounded-xl border-l-4 ${resultado.viagemViavel ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            {resultado.destinosSugeridos && resultado.destinosSugeridos.length > 0 ? (
              <div>
                <p className="font-medium mb-4">{resultado.mensagem}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resultado.destinosSugeridos.map((d) => (
                    <div
                      key={d.id}
                      className="bg-white p-4 rounded-lg border cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setForm({ ...form, destinoId: d.id })}
                    >
                      <h4 className="font-semibold text-primary-dark">{d.nome}</h4>
                      <p className="text-sm text-gray-500">{d.cidade}, {d.provincia}</p>
                      <p className="mt-2">Custo: <strong>{formatMoney(d.custoTotalEstimado)}</strong></p>
                      <Badge variant={d.viavel ? 'success' : 'danger'}>{d.viavel ? 'Viavel' : 'Acima do orcamento'}</Badge>
                      {d.viavel && (
                        <div className="flex gap-2 mt-3">
                          <Button variant="accent" className="text-xs flex-1" onClick={(e) => { e.stopPropagation(); irReservar(d.id); }}>
                            Reservar
                          </Button>
                          <Button variant="secondary" className="text-xs flex-1" onClick={(e) => { e.stopPropagation(); criarMetaPoupanca(d.id, d.custoTotalEstimado, `Poupanca: ${d.nome}`); }}>
                            Criar meta
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-primary-dark">{resultado.destinoNome}</h3>
                <p className="text-gray-500">{resultado.destinoCidade}, {resultado.destinoProvincia}</p>
                <p className="mt-2">{resultado.mensagem}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {[
                    { label: 'Hospedagem (40%)', value: resultado.custoHospedagem },
                    { label: 'Alimentacao (25%)', value: resultado.custoAlimentacao },
                    { label: 'Transporte (20%)', value: resultado.custoTransporte },
                    { label: 'Atividades (15%)', value: resultado.custoAtividades },
                  ].map((item) => (
                    <div key={item.label} className="bg-white p-3 rounded-lg text-center">
                      <div className="text-lg font-bold text-primary">{formatMoney(item.value)}</div>
                      <div className="text-xs text-gray-500">{item.label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xl font-bold mt-4">Custo Total: {formatMoney(resultado.custoTotal)}</p>
                <p>Saldo: <strong>{formatMoney(resultado.saldoRestante)}</strong></p>
                <Badge variant={resultado.viagemViavel ? 'success' : 'danger'}>
                  {resultado.viagemViavel ? 'Viagem Viavel' : 'Acima do Orcamento'}
                </Badge>
                {resultado.viagemViavel && resultado.destinoId && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button variant="accent" onClick={() => irReservar(resultado.destinoId!, resultado.numeroDias)}>
                      Reservar esta viagem
                    </Button>
                    <Button variant="secondary" onClick={() => criarMetaPoupanca(resultado.destinoId, resultado.custoTotal, `Poupanca: ${resultado.destinoNome}`)}>
                      Criar meta de poupanca
                    </Button>
                  </div>
                )}

                {(resultado.hoteisSugeridos?.length || resultado.restaurantesSugeridos?.length) ? (
                  <div className="mt-6 space-y-4">
                    <p className="font-medium text-primary-dark">Sugestoes para o seu roteiro (parceiros em destaque)</p>
                    {resultado.hoteisSugeridos && resultado.hoteisSugeridos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Hospedagem sugerida</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {resultado.hoteisSugeridos.map((h) => (
                            <EstabelecimentoCard key={h.id} estabelecimento={h} />
                          ))}
                        </div>
                      </div>
                    )}
                    {resultado.restaurantesSugeridos && resultado.restaurantesSugeridos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Restaurantes sugeridos</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {resultado.restaurantesSugeridos.map((r) => (
                            <EstabelecimentoCard key={r.id} estabelecimento={r} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}
      </Card>

      <Card title="As Minhas Simulacoes Guardadas">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-3 px-2">Titulo</th>
                <th className="py-3 px-2">Destino</th>
                <th className="py-3 px-2">Dias</th>
                <th className="py-3 px-2">Custo Total</th>
                <th className="py-3 px-2">Viavel</th>
                <th className="py-3 px-2">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {simulacoes.map((s) => (
                <tr key={s.simulacaoId} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{s.titulo || '-'}</td>
                  <td className="py-3 px-2">{s.destinoNome}</td>
                  <td className="py-3 px-2">{s.numeroDias}</td>
                  <td className="py-3 px-2">{formatMoney(s.custoTotal)}</td>
                  <td className="py-3 px-2">
                    <Badge variant={s.viagemViavel ? 'success' : 'danger'}>
                      {s.viagemViavel ? 'Sim' : 'Nao'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleDelete(s.simulacaoId!)}>Remover</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
