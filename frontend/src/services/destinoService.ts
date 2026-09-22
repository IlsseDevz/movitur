import api from './api';
import type { Destino, DestinoRequest, DestinoOrdenacao } from '@/types';

export interface DestinoListParams {
  ativo?: boolean;
  categoriaId?: number;
  provincia?: string;
  q?: string;
  precoMin?: number;
  precoMax?: number;
  ordenacao?: DestinoOrdenacao;
}

export const destinoService = {
  listar: (params?: DestinoListParams) =>
    api.get<Destino[]>('/destinos', { params }).then((r) => r.data),

  buscar: (id: number) =>
    api.get<Destino>(`/destinos/${id}`).then((r) => r.data),

  criar: (data: DestinoRequest) =>
    api.post<Destino>('/destinos', data).then((r) => r.data),

  atualizar: (id: number, data: DestinoRequest) =>
    api.put<Destino>(`/destinos/${id}`, data).then((r) => r.data),

  remover: (id: number) =>
    api.delete(`/destinos/${id}`),
};
