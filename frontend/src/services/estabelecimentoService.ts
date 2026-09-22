import api from './api';
import type { Estabelecimento, EstabelecimentoRequest, TipoEstabelecimento } from '@/types';

export interface EstabelecimentoFiltros {
  tipo?: TipoEstabelecimento;
  destinoId?: number;
  provincia?: string;
  cidade?: string;
  ativo?: boolean;
}

export const estabelecimentoService = {
  listar(filtros: EstabelecimentoFiltros = {}) {
    return api.get<Estabelecimento[]>('/estabelecimentos', { params: filtros }).then((r) => r.data);
  },

  buscar(id: number) {
    return api.get<Estabelecimento>(`/estabelecimentos/${id}`).then((r) => r.data);
  },

  criar(data: EstabelecimentoRequest) {
    return api.post<Estabelecimento>('/estabelecimentos', data).then((r) => r.data);
  },

  atualizar(id: number, data: EstabelecimentoRequest) {
    return api.put<Estabelecimento>(`/estabelecimentos/${id}`, data).then((r) => r.data);
  },

  remover(id: number) {
    return api.delete(`/estabelecimentos/${id}`);
  },
};
