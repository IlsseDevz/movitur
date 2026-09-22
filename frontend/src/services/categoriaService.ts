import api from './api';
import type { Categoria, CategoriaRequest, TipoExperiencia } from '@/types';

export const categoriaService = {
  listar: (params?: { ativo?: boolean; tipoExperiencia?: TipoExperiencia }) =>
    api.get<Categoria[]>('/categorias', { params }).then((r) => r.data),

  buscar: (id: number) =>
    api.get<Categoria>(`/categorias/${id}`).then((r) => r.data),

  criar: (data: CategoriaRequest) =>
    api.post<Categoria>('/categorias', data).then((r) => r.data),

  atualizar: (id: number, data: CategoriaRequest) =>
    api.put<Categoria>(`/categorias/${id}`, data).then((r) => r.data),

  remover: (id: number) =>
    api.delete(`/categorias/${id}`),
};
