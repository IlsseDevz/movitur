'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Button, Card, Input, Select, Badge } from '@/components';
import { ImageUploadInput } from '@/components/ImageUploadInput';
import { estabelecimentoService, destinoService } from '@/services';
import type { Destino, Estabelecimento, EstabelecimentoRequest, PlanoAnuncio, StatusPagamentoEstabelecimento, TipoEstabelecimento } from '@/types';

const PLANOS: { value: PlanoAnuncio; label: string }[] = [
  { value: 'GRATUITO', label: 'Gratuito' },
  { value: 'BRONZE', label: 'Bronze' },
  { value: 'PRATA', label: 'Prata' },
  { value: 'OURO', label: 'Ouro' },
];

const STATUS: { value: StatusPagamentoEstabelecimento; label: string }[] = [
  { value: 'ATIVO', label: 'Ativo' },
  { value: 'PENDENTE', label: 'Pendente' },
  { value: 'INATIVO', label: 'Inativo' },
];

const TIPOS: { value: TipoEstabelecimento; label: string }[] = [
  { value: 'HOTEL', label: 'Hotel' },
  { value: 'RESTAURANTE', label: 'Restaurante' },
];

const emptyForm: EstabelecimentoRequest = {
  nome: '',
  descricao: '',
  tipo: 'HOTEL',
  imagemUrl: '',
  endereco: '',
  avaliacaoMedia: 4.0,
  precoMedio: undefined,
  destinoId: 0,
  planoAnuncio: 'GRATUITO',
  statusPagamento: 'INATIVO',
  dataExpiracao: '',
  ativo: true,
};

export function AdminEstabelecimentosPage() {
  const [items, setItems] = useState<Estabelecimento[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [form, setForm] = useState<EstabelecimentoRequest>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => estabelecimentoService.listar({ ativo: undefined }).then(setItems).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    destinoService.listar().then(setDestinos).catch(console.error);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data: EstabelecimentoRequest = {
        ...form,
        precoMedio: form.precoMedio ? Number(form.precoMedio) : undefined,
        avaliacaoMedia: form.avaliacaoMedia ? Number(form.avaliacaoMedia) : undefined,
        dataExpiracao: form.dataExpiracao || undefined,
      };
      if (editId) await estabelecimentoService.atualizar(editId, data);
      else await estabelecimentoService.criar(data);
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Estabelecimento) => {
    setEditId(item.id);
    setForm({
      nome: item.nome,
      descricao: item.descricao || '',
      tipo: item.tipo,
      imagemUrl: item.imagemUrl || '',
      endereco: item.endereco || '',
      avaliacaoMedia: item.avaliacaoMedia,
      precoMedio: item.precoMedio,
      destinoId: item.destinoId,
      planoAnuncio: item.planoAnuncio,
      statusPagamento: item.statusPagamento,
      dataExpiracao: item.dataExpiracao || '',
      ativo: item.ativo,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este estabelecimento?')) return;
    try {
      await estabelecimentoService.remover(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Estabelecimentos</h2>
        <p className="text-slate-400">Gerir hoteis, restaurantes e planos de destaque pago</p>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

      <Card title={editId ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Select label="Tipo *" options={TIPOS} value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoEstabelecimento })} />
          <Select
            label="Destino *"
            options={[{ value: 0, label: 'Selecione...' }, ...destinos.map((d) => ({ value: d.id, label: d.nome }))]}
            value={form.destinoId}
            onChange={(e) => setForm({ ...form, destinoId: Number(e.target.value) })}
            required
          />
          <Select label="Plano de anuncio *" options={PLANOS} value={form.planoAnuncio} onChange={(e) => setForm({ ...form, planoAnuncio: e.target.value as PlanoAnuncio })} />
          <Select label="Status pagamento *" options={STATUS} value={form.statusPagamento} onChange={(e) => setForm({ ...form, statusPagamento: e.target.value as StatusPagamentoEstabelecimento })} />
          <Input label="Data expiracao" type="date" value={form.dataExpiracao || ''} onChange={(e) => setForm({ ...form, dataExpiracao: e.target.value })} />
          <Input label="Avaliacao (0-5)" type="number" min="0" max="5" step="0.1" value={form.avaliacaoMedia ?? ''} onChange={(e) => setForm({ ...form, avaliacaoMedia: Number(e.target.value) })} />
          <Input label="Preco medio (MZN)" type="number" min="0" step="0.01" value={form.precoMedio ?? ''} onChange={(e) => setForm({ ...form, precoMedio: e.target.value ? Number(e.target.value) : undefined })} />
          <Input label="Endereco" value={form.endereco || ''} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
          <ImageUploadInput label="Imagem" value={form.imagemUrl || ''} onChange={(imagemUrl) => setForm({ ...form, imagemUrl })} tipo="destinos" />
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Descricao</label>
            <textarea className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
            <span className="text-sm text-gray-600">Ativo</span>
          </label>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={loading}>{editId ? 'Atualizar' : 'Guardar'}</Button>
            {editId && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card title={`Lista (${items.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm text-gray-500">
                <th className="py-3 px-2">Nome</th>
                <th className="py-3 px-2">Tipo</th>
                <th className="py-3 px-2">Destino</th>
                <th className="py-3 px-2">Plano</th>
                <th className="py-3 px-2">Prioridade</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">
                    {e.nome}
                    {e.patrocinado && <Badge variant="warning" >Destaque</Badge>}
                  </td>
                  <td className="py-3 px-2">{e.tipo}</td>
                  <td className="py-3 px-2">{e.destinoNome}</td>
                  <td className="py-3 px-2">{e.planoAnuncio}</td>
                  <td className="py-3 px-2">{e.prioridadeEfectiva ?? 0}</td>
                  <td className="py-3 px-2">
                    <Badge variant={e.ativo ? 'success' : 'danger'}>{e.ativo ? 'Ativo' : 'Inativo'}</Badge>
                  </td>
                  <td className="py-3 px-2 flex gap-2">
                    <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => handleEdit(e)}>Editar</Button>
                    <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleDelete(e.id)}>Remover</Button>
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
