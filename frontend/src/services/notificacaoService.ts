import api from './api';
import type { Notificacao } from '@/types';

export const notificacaoService = {
  listar: () =>
    api.get<Notificacao[]>('/notificacoes').then((r) => r.data),

  contarNaoLidas: () =>
    api.get<{ total: number }>('/notificacoes/nao-lidas/contagem').then((r) => r.data.total),

  marcarLida: (id: number) =>
    api.put<Notificacao>(`/notificacoes/${id}/lida`).then((r) => r.data),

  marcarTodasLidas: () =>
    api.put<{ actualizadas: number }>('/notificacoes/marcar-todas-lidas').then((r) => r.data),
};
