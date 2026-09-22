import api from './api';
import type { Reserva, ReservaRequest, StatusReserva } from '@/types';

export const reservaService = {
  criar: (data: ReservaRequest) =>
    api.post<Reserva>('/reservas', data).then((r) => r.data),

  listarMinhas: () =>
    api.get<Reserva[]>('/reservas').then((r) => r.data),

  buscar: (id: number) =>
    api.get<Reserva>(`/reservas/${id}`).then((r) => r.data),

  cancelar: (id: number) =>
    api.put<Reserva>(`/reservas/${id}/cancelar`).then((r) => r.data),
};

export const reservaAdminService = {
  listar: (status?: StatusReserva) =>
    api.get<Reserva[]>('/admin/reservas', { params: status ? { status } : {} }).then((r) => r.data),

  confirmar: (id: number) =>
    api.put<Reserva>(`/admin/reservas/${id}/confirmar`).then((r) => r.data),

  rejeitar: (id: number) =>
    api.put<Reserva>(`/admin/reservas/${id}/rejeitar`).then((r) => r.data),

  cancelar: (id: number) =>
    api.put<Reserva>(`/admin/reservas/${id}/cancelar`).then((r) => r.data),
};
