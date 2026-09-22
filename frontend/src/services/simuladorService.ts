import api from './api';
import type { SimuladorRequest, SimuladorResponse } from '@/types';

export const simuladorService = {
  calcular: (data: SimuladorRequest) =>
    api.post<SimuladorResponse>('/simulador/calcular', data).then((r) => r.data),

  listar: () =>
    api.get<SimuladorResponse[]>('/simulador').then((r) => r.data),

  buscar: (id: number) =>
    api.get<SimuladorResponse>(`/simulador/${id}`).then((r) => r.data),

  remover: (id: number) =>
    api.delete(`/simulador/${id}`),
};
