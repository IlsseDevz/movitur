import api from './api';
import type { StatusConta, Usuario } from '@/types';

export const adminService = {
  async listarUsuarios(status?: StatusConta): Promise<Usuario[]> {
    const params = status ? { status } : {};
    const { data } = await api.get<Usuario[]>('/admin/usuarios', { params });
    return data;
  },

  async dashboardStats(): Promise<{ reservasPendentes: number }> {
    const { data } = await api.get<{ reservasPendentes: number }>('/admin/dashboard/stats');
    return data;
  },

  async aprovar(id: number): Promise<Usuario> {
    const { data } = await api.put<Usuario>(`/admin/usuarios/${id}/aprovar`);
    return data;
  },

  async rejeitar(id: number, motivo?: string): Promise<Usuario> {
    const { data } = await api.put<Usuario>(`/admin/usuarios/${id}/rejeitar`, { motivo });
    return data;
  },
};
