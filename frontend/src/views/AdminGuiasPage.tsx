'use client';

import { useCallback, useEffect, useState, FormEvent, useMemo } from 'react';
import { Button, Card, Input, Select, Badge } from '@/components';
import { ImageUploadInput } from '@/components/ImageUploadInput';
import { useToast } from '@/context/ToastContext';
import { guiaService, destinoService } from '@/services';
import type { GuiaTuristico, GuiaTuristicoRequest, Destino } from '@/types';

const emptyForm: GuiaTuristicoRequest = {
  nome: '',
  biografia: '',
  anosExperiencia: 0,
  fotoUrl: '',
  destinoIds: [],
  ativo: true,
};

export function AdminGuiasPage() {
  const { showToast } = useToast();
  const [guias, setGuias] = useState<GuiaTuristico[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [form, setForm] = useState<GuiaTuristicoRequest>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  const load = useCallback(async () => {
    setListLoading(true);
    setError('');
    try {
      const data = await guiaService.listar({
        ativo: filtroAtivo === 'TODOS' ? undefined : filtroAtivo === 'ATIVO',
        destinoId: destinoId ? Number(destinoId) : undefined,
      });
      setGuias(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar guias');
    } finally {
      setListLoading(false);
    }
  }, [filtroAtivo, destinoId]);

  useEffect(() => {
    destinoService.listar().then(setDestinos).catch(console.error);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const destinosPorId = useMemo(
    () => Object.fromEntries(destinos.map((d) => [d.id, d.nome])),
    [destinos],
  );

  const filtrados = useMemo(() => {
    const termo = q.trim().toLowerCase();
    if (!termo) return guias;
    return guias.filter(
      (g) =>
        g.nome.toLowerCase().includes(termo) ||
        (g.biografia?.toLowerCase().includes(termo) ?? false),
    );
  }, [guias, q]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await guiaService.atualizar(editId, form);
        showToast('Guia actualizado.', 'success');
      } else {
        await guiaService.criar(form);
        showToast('Guia criado.', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guia: GuiaTuristico) => {
    setEditId(guia.id);
    setForm({
      nome: guia.nome,
      biografia: guia.biografia || '',
      anosExperiencia: guia.anosExperiencia,
      fotoUrl: guia.fotoUrl || '',
      destinoIds: guia.destinoIds,
      ativo: guia.ativo,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover este guia?')) return;
    try {
      await guiaService.remover(id);
      showToast('Guia removido.', 'info');
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const toggleDestino = (id: number) => {
    const ids = form.destinoIds || [];
    setForm({
      ...form,
      destinoIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    });
  };

  const limparFiltros = () => {
    setQ('');
    setDestinoId('');
    setFiltroAtivo('TODOS');
  };

  const temFiltros = q || destinoId || filtroAtivo !== 'TODOS';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Guias Turisticos</h2>
        <p className="text-slate-400">Gerir perfis publicos de guias (sem contactos expostos)</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <Card title={editId ? 'Editar Guia' : 'Novo Guia'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Nome *" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
          <Input label="Anos de Experiencia *" type="number" min="0" value={form.anosExperiencia} onChange={(e) => setForm({ ...form, anosExperiencia: Number(e.target.value) })} required />
          <ImageUploadInput
            label="Foto do guia"
            value={form.fotoUrl || ''}
            onChange={(fotoUrl) => setForm({ ...form, fotoUrl })}
            tipo="guias"
            urlLabel="URL da foto"
          />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.checked })} />
            <span className="text-sm text-gray-600">Ativo</span>
          </label>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Destinos</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {destinos.map((d) => (
                <label key={d.id} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={form.destinoIds?.includes(d.id)} onChange={() => toggleDestino(d.id)} />
                  <span className="text-sm">{d.nome}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Biografia</label>
            <textarea className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.biografia} onChange={(e) => setForm({ ...form, biografia: e.target.value })} rows={3} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={loading}>{editId ? 'Atualizar' : 'Guardar'}</Button>
            {editId && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card title={`Lista de Guias (${filtrados.length})`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Input
            label="Pesquisar"
            placeholder="Nome..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            label="Destino"
            options={[
              { value: '', label: 'Todos' },
              ...destinos.map((d) => ({ value: d.id, label: d.nome })),
            ]}
            value={destinoId}
            onChange={(e) => setDestinoId(e.target.value)}
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
          {temFiltros && (
            <div className="flex items-end">
              <Button type="button" variant="secondary" onClick={limparFiltros}>Limpar filtros</Button>
            </div>
          )}
        </div>

        {listLoading ? (
          <p className="text-gray-500 text-center py-8">A carregar...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum guia encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="py-3 px-2">Nome</th>
                  <th className="py-3 px-2">Experiencia</th>
                  <th className="py-3 px-2">Destinos</th>
                  <th className="py-3 px-2">Avaliacao</th>
                  <th className="py-3 px-2">Estado</th>
                  <th className="py-3 px-2">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((g) => (
                  <tr key={g.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{g.nome}</td>
                    <td className="py-3 px-2">{g.anosExperiencia} anos</td>
                    <td className="py-3 px-2 text-xs text-gray-600 max-w-[200px]">
                      {g.destinoIds.length > 0
                        ? g.destinoIds.map((id) => destinosPorId[id] || `#${id}`).join(', ')
                        : '-'}
                    </td>
                    <td className="py-3 px-2"><Badge variant="warning">{g.avaliacaoMedia.toFixed(1)}</Badge></td>
                    <td className="py-3 px-2">
                      <Badge variant={g.ativo ? 'success' : 'danger'}>{g.ativo ? 'Ativo' : 'Inativo'}</Badge>
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => handleEdit(g)}>Editar</Button>
                      <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleDelete(g.id)}>Remover</Button>
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
