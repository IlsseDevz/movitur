import api from './api';
import type { Avaliacao, AvaliacaoRequest } from '@/types';

export const avaliacaoService = {
  criar: (data: AvaliacaoRequest) =>
    api.post<Avaliacao>('/avaliacoes', data).then((r) => r.data),

  listarPorGuia: (guiaId: number) =>
    api.get<Avaliacao[]>(`/avaliacoes/guia/${guiaId}`).then((r) => r.data),
};
