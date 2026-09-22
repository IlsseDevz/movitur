'use client';

import { useCallback, useEffect, useState, FormEvent, useMemo } from 'react';
import { Button, Card, Input, Select, Badge } from '@/components';
import { useToast } from '@/context/ToastContext';
import { categoriaService } from '@/services';
import type { Categoria, CategoriaRequest, TipoExperiencia } from '@/types';

const TIPOS: { value: TipoExperiencia; label: string }[] = [
  { value: 'AVENTURA', label: 'Aventura' },
  { value: 'PRAIA', label: 'Praia' },
  { value: 'CULTURA', label: 'Cultura' },
  { value: 'LUXO', label: 'Luxo' },
  { value: 'FAMILIA', label: 'Familia' },
];

const emptyForm: CategoriaRequest = {
  nome: '',
  descricao: '',
  tipoExperiencia: 'PRAIA',
  ativo: true,
};

export function AdminCategoriasPage() {
  const { showToast } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<CategoriaRequest>(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');

  const [q, setQ] = useState('');
  const [tipoExperiencia, setTipoExperiencia] = useState('');
  const [filtroAtivo, setFiltroAtivo] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  const load = useCallback(async () => {
    setListLoading(true);
    setError('');
    try {
      const data = await categoriaService.listar({
        ativo: filtroAtivo === 'TODOS' ? undefined : filtroAtivo === 'ATIVO',
        tipoExperiencia: tipoExperiencia ? (tipoExperiencia as TipoExperiencia) : undefined,
      });
      setCategorias(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar categorias');
    } finally {
      setListLoading(false);
    }
  }, [filtroAtivo, tipoExperiencia]);

  useEffect(() => {
    load();
  }, [load]);

  const filtradas = useMemo(() => {
    const termo = q.trim().toLowerCase();
    if (!termo) return categorias;
    return categorias.filter(
      (c) =>
        c.nome.toLowerCase().includes(termo) ||
        (c.descricao?.toLowerCase().includes(termo) ?? false),
    );
  }, [categorias, q]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await categoriaService.atualizar(editId, form);
        showToast('Categoria actualizada.', 'success');
      } else {
        await categoriaService.criar(form);
        showToast('Categoria criada.', 'success');
      }
      resetForm();
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao guardar');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: Categoria) => {
    setEditId(cat.id);
    setForm({
      nome: cat.nome,
      descricao: cat.descricao || '',
      tipoExperiencia: cat.tipoExperiencia,
      ativo: cat.ativo,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remover esta categoria?')) return;
    try {
      await categoriaService.remover(id);
      showToast('Categoria removida.', 'info');
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
    setTipoExperiencia('');
    setFiltroAtivo('TODOS');
  };

  const temFiltros = q || tipoExperiencia || filtroAtivo !== 'TODOS';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Categorias</h2>
        <p className="text-slate-400">Gerir tipos de experiencia turistica</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <Card title={editId ? 'Editar Categoria' : 'Nova Categoria'}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome *"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <Select
            label="Tipo de Experiencia *"
            options={TIPOS}
            value={form.tipoExperiencia}
            onChange={(e) => setForm({ ...form, tipoExperiencia: e.target.value as TipoExperiencia })}
          />
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-600">Descricao</label>
            <textarea
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            />
            <span className="text-sm text-gray-600">Ativo</span>
          </label>
          <div className="md:col-span-2 flex gap-3">
            <Button type="submit" disabled={loading}>{editId ? 'Atualizar' : 'Guardar'}</Button>
            {editId && <Button type="button" variant="secondary" onClick={resetForm}>Cancelar</Button>}
          </div>
        </form>
      </Card>

      <Card title={`Lista de Categorias (${filtradas.length})`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <Input
            label="Pesquisar"
            placeholder="Nome..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            label="Tipo"
            options={[{ value: '', label: 'Todos' }, ...TIPOS]}
            value={tipoExperiencia}
            onChange={(e) => setTipoExperiencia(e.target.value)}
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
        ) : filtradas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma categoria encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Nome</th>
                  <th className="py-3 px-2">Tipo</th>
                  <th className="py-3 px-2">Estado</th>
                  <th className="py-3 px-2">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2">{cat.id}</td>
                    <td className="py-3 px-2 font-medium">{cat.nome}</td>
                    <td className="py-3 px-2"><Badge>{cat.tipoExperiencia}</Badge></td>
                    <td className="py-3 px-2">
                      <Badge variant={cat.ativo ? 'success' : 'danger'}>
                        {cat.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      <Button variant="secondary" className="text-xs px-2 py-1" onClick={() => handleEdit(cat)}>Editar</Button>
                      <Button variant="danger" className="text-xs px-2 py-1" onClick={() => handleDelete(cat.id)}>Remover</Button>
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
