'use client';

import { useCallback, useEffect, useState, FormEvent } from 'react';
import { Button, Card, Input, Select, Badge } from '@/components';
import { ImageUploadInput } from '@/components/ImageUploadInput';
import { useToast } from '@/context/ToastContext';
import { destinoService, categoriaService } from '@/services';
import type { Destino, DestinoRequest, Categoria, DestinoOrdenacao } from '@/types';

const ORDENACOES: { value: DestinoOrdenacao; label: string }[] = [
  { value: 'NOME_ASC', label: 'Nome (A-Z)' },
  { value: 'NOME_DESC', label: 'Nome (Z-A)' },
  { value: 'PRECO_ASC', label: 'Preco (menor)' },
  { value: 'PRECO_DESC', label: 'Preco (maior)' },
];

const emptyForm: DestinoRequest = {
  nome: '',
  descricao: '',
  provincia: '',
  cidade: '',
  imagemUrl: '',
  precoMedioEstimado: undefined,
  latitude: undefined,
  longitude: undefined,
  categoriaId: 0,
  ativo: true,
};

export function AdminDestinosPage() {
  const { showToast } = useToast();
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [form, setForm] = useState<DestinoRequest>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [provincia, setProvincia] = useState('');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');
  const [ordenacao, setOrdenacao] = useState<DestinoOrdenacao>('NOME_ASC');
  const [filtroAtivo, setFiltroAtivo] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  const load = useCallback(async () => {
    setListLoading(true);
    setError('');
    try {
      const data = await destinoService.listar({
        ativo: filtroAtivo === 'TODOS' ? undefined : filtroAtivo === 'ATIVO',
        categoriaId: categoriaId ? Number(categoriaId) : undefined,
        provincia: provincia || undefined,
        q: q.trim() || undefined,
        precoMin: precoMin ? Number(precoMin) : undefined,
        precoMax: precoMax ? Number(precoMax) : undefined,
        ordenacao,
      });
      setDestinos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar destinos');
    } finally {
      setListLoading(false);
    }
  }, [q, categoriaId, provincia, precoMin, precoMax, ordenacao, filtroAtivo]);

  useEffect(() => {
    categoriaService.listar().then(setCategorias).catch(console.error);
    destinoService.listar().then((data) => {
      setProvincias([...new Set(data.map((d) => d.provincia))].sort());
    }).catch(console.error);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = {
        ...form,
        precoMedioEstimado: form.precoMedioEstimado ? Number(form.precoMedioEstimado) : undefined,
        latitude: form.latitude != null ? Number(form.latitude) : undefined,
        longitude: form.longitude != null ? Number(form.longitude) : undefined,
      };
      if (editId) {
        await destinoService.atualizar(editId, data);
        showToast('Destino actualizado.', 'success');
      } else {
        await destinoService.criar(data);
        showToast('Destino criado.', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (dest: Destino) => {
    setEditId(dest.id);
    setForm({
      nome: dest.nome,
      descricao: dest.descricao || '',
      provincia: dest.provincia,
      cidade: dest.cidade,
      imagemUrl: dest.imagemUrl || '',
      precoMedioEstimado: dest.precoMedioEstimado,
      latitude: dest.latitude,
      longitude: dest.longitude,
      categoriaId: dest.categoriaId,
      ativo: dest.ativo,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este destino?')) return;
    try {
      await destinoService.remover(id);
      showToast('Destino removido.', 'info');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const limparFiltros = () => {
    setQ('');
    setCategoriaId('');
    setProvincia('');
    setPrecoMin('');
    setPrecoMax('');
    setOrdenacao('NOME_ASC');
    setFiltroAtivo('TODOS');
  };

  const temFiltros = q || categoriaId || provincia || precoMin || precoMax || ordenacao !== 'NOME_ASC' || filtroAtivo !== 'TODOS';

  const formatMoney = (v?: number) =>
    v != null ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v) : '-';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Destinos</h2>
        <p className="text-slate-400">Gerir locais turisticos de Mocambique</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <Card title={editId ? 'Editar Destino' : 'Novo Destino'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Select
            label="Categoria *"
            options={[{ value: 0, label: 'Selecione...' }, ...categorias.map((c) => ({ value: c.id, label: c.nome }))]}
            value={form.categoriaId}
            onChange={(e) => setForm({ ...form, categoriaId: Number(e.target.value) })}
            required
          />
          <Input label="Provincia *" value={form.provincia} onChange={(e) => setForm({ ...form, provincia: e.target.value })} required />
          <Input label="Cidade *" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} required />
          <Input label="Preco Medio Diario (MZN)" type="number" min="0" step="0.01" value={form.precoMedioEstimado ?? ''} onChange={(e) => setForm({ ...form, precoMedioEstimado: e.target.value ? Number(e.target.value) : undefined })} />
          <ImageUploadInput
            label="Imagem do destino"
            value={form.imagemUrl || ''}
            onChange={(imagemUrl) => setForm({ ...form, imagemUrl })}
            tipo="destinos"
          />
          <Input label="Latitude" type="number" step="any" placeholder="Ex: -25.969" value={form.latitude ?? ''} onChange={(e) => setForm({ ...form, latitude: e.target.value ? Number(e.target.value) : undefined })} />
          <Input label="Longitude" type="number" step="any" placeholder="Ex: 32.573" value={form.longitude ?? ''} onChange={(e) => setForm({ ...form, longitude: e.target.value ? Number(e.target.value) : undefined })} />
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

      <Card title={`Lista de Destinos (${destinos.length})`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Input
            label="Pesquisar"
            placeholder="Nome, cidade..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            label="Categoria"
            options={[{ value: '', label: 'Todas' }, ...categorias.map((c) => ({ value: c.id, label: c.nome }))]}
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          />
          <Select
            label="Provincia"
            options={[{ value: '', label: 'Todas' }, ...provincias.map((p) => ({ value: p, label: p }))]}
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
          />
          <Select
            label="Estado"
            options={[
              { value: 'TODOS', label: 'Todos' },
              { value: 'ATIVO', label: 'Activos' },
              { value: 'INATIVO', label: 'Inactivos' },
            ]}
            value={filtroAtivo}
            onChange={(e) => setFiltroAtivo(e.target.value as typeof filtroAtivo)}
          />
          <Input
            label="Preco min (MZN)"
            type="number"
            min="0"
            value={precoMin}
            onChange={(e) => setPrecoMin(e.target.value)}
          />
          <Input
            label="Preco max (MZN)"
            type="number"
            min="0"
            value={precoMax}
            onChange={(e) => setPrecoMax(e.target.value)}
          />
          <Select
            label="Ordenar"
            options={ORDENACOES}
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as DestinoOrdenacao)}
          />
          {temFiltros && (
            <div className="flex items-end">
              <Button type="button" variant="secondary" onClick={limparFiltros}>Limpar filtros</Button>
            </div>
          )}
        </div>

        {listLoading ? (
          <p className="text-gray-500 text-center py-8">A carregar...</p>
        ) : destinos.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum destino encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="py-3 px-2">Nome</th>
                  <th className="py-3 px-2">Cidade</th>
                  <th className="py-3 px-2">Provincia</th>
                  <th className="py-3 px-2">Categoria</th>
                  <th className="py-3 px-2">Preco/Dia</th>
                  <th className="py-3 px-2">Coords</th>
                  <th className="py-3 px-2">Estado</th>
                  <th className="py-3 px-2">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {destinos.map((d) => (
                  <tr key={d.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{d.nome}</td>
                    <td className="py-3 px-2">{d.cidade}</td>
                    <td className="py-3 px-2">{d.provincia}</td>
                    <td className="py-3 px-2"><Badge>{d.categoriaNome}</Badge></td>
                    <td className="py-3 px-2">{formatMoney(d.precoMedioEstimado)}</td>
                    <td className="py-3 px-2 text-xs text-gray-500">
                      {d.latitude != null && d.longitude != null
                        ? `${d.latitude.toFixed(3)}, ${d.longitude.toFixed(3)}`
                        : '-'}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={d.ativo ? 'success' : 'danger'}>{d.ativo ? 'Ativo' : 'Inativo'}</Badge>
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => handleEdit(d)}>Editar</Button>
                      <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleDelete(d.id)}>Remover</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
