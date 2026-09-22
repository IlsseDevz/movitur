import api from './api';
import type { RelatorioResumo } from '@/types';

async function downloadCsv(path: string, filename: string) {
  const response = await api.get(path, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export const relatorioAdminService = {
  resumo: () =>
    api.get<RelatorioResumo>('/admin/relatorios/resumo').then((r) => r.data),

  exportarReservas: () =>
    downloadCsv('/admin/relatorios/reservas.csv', 'movitur-reservas.csv'),

  exportarPagamentos: () =>
    downloadCsv('/admin/relatorios/pagamentos.csv', 'movitur-pagamentos.csv'),
};
