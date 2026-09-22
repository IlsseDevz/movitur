import api from './api';

export type UploadTipo = 'destinos' | 'guias';

export const uploadService = {
  async enviarImagem(file: File, tipo: UploadTipo): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', tipo);

    const { data } = await api.post<{ url: string }>('/admin/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });

    return data.url;
  },
};
