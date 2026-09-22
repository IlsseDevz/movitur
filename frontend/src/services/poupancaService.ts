import api from './api';
import type {
  MetaPoupanca, MetaPoupancaRequest,
  DepositoPoupanca, DepositoPoupancaRequest,
  Pagamento, PagamentoRequest,
} from '@/types';

export const poupancaService = {
  listar: () =>
    api.get<MetaPoupanca[]>('/poupancas').then((r) => r.data),

  criar: (data: MetaPoupancaRequest) =>
    api.post<MetaPoupanca>('/poupancas', data).then((r) => r.data),

  buscar: (id: number) =>
    api.get<MetaPoupanca>(`/poupancas/${id}`).then((r) => r.data),

  depositar: (id: number, data: DepositoPoupancaRequest) =>
    api.post<DepositoPoupanca>(`/poupancas/${id}/depositos`, data).then((r) => r.data),

  listarDepositos: (id: number) =>
    api.get<DepositoPoupanca[]>(`/poupancas/${id}/depositos`).then((r) => r.data),

  encerrar: (id: number) =>
    api.put<MetaPoupanca>(`/poupancas/${id}/encerrar`).then((r) => r.data),
};

export const pagamentoService = {
  pagar: (data: PagamentoRequest) =>
    api.post<Pagamento>('/pagamentos', data).then((r) => r.data),

  listarMinhas: () =>
    api.get<Pagamento[]>('/pagamentos').then((r) => r.data),

  listarPorReserva: (reservaId: number) =>
    api.get<Pagamento[]>(`/pagamentos/reserva/${reservaId}`).then((r) => r.data),
};

export const pagamentoAdminService = {
  listar: (status?: string) =>
    api.get<Pagamento[]>('/admin/pagamentos', { params: status ? { status } : {} }).then((r) => r.data),

  confirmar: (id: number) =>
    api.put<Pagamento>(`/admin/pagamentos/${id}/confirmar`).then((r) => r.data),

  rejeitar: (id: number, motivo?: string) =>
    api.put<Pagamento>(`/admin/pagamentos/${id}/rejeitar`, { motivo }).then((r) => r.data),
};
