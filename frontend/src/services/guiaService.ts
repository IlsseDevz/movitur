import api from './api';
import type { GuiaTuristico, GuiaTuristicoRequest } from '@/types';

export const guiaService = {
  listar: (params?: { ativo?: boolean; destinoId?: number }) =>
    api.get<GuiaTuristico[]>('/guias', { params }).then((r) => r.data),

  buscar: (id: number) =>
    api.get<GuiaTuristico>(`/guias/${id}`).then((r) => r.data),

  criar: (data: GuiaTuristicoRequest) =>
    api.post<GuiaTuristico>('/guias', data).then((r) => r.data),

  atualizar: (id: number, data: GuiaTuristicoRequest) =>
    api.put<GuiaTuristico>(`/guias/${id}`, data).then((r) => r.data),

  remover: (id: number) =>
    api.delete(`/guias/${id}`),
};
