import axios from 'axios';
import type { ApiError } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('movitur_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('movitur_token');
      localStorage.removeItem('movitur_user');
      const path = window.location.pathname;
      const isPublicExplore = path === '/' || path === '/cliente'
        || /^\/cliente\/(categorias|destinos|guias|hoteis|restaurantes|estabelecimentos)(\/|$)/.test(path);
      const isAuthPage = path.includes('/login') || path.includes('/registo') || path.includes('/recuperar');
      if (!isAuthPage && !isPublicExplore) {
        const destino = path.startsWith('/admin') ? '/admin/login' : '/cliente/login';
        window.location.href = destino;
      }
    }
    const data = error.response?.data as ApiError | undefined;
    const isTimeout = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '');
    const isNetwork = !error.response && (error.code === 'ERR_NETWORK' || isTimeout);
    const message = isNetwork
      ? 'Servidor indisponivel. Verifique se o backend esta a correr (porta 8080).'
      : data?.message
      || (data?.errors ? Object.values(data.errors).join(', ') : null)
      || error.message
      || 'Erro na requisicao';
    return Promise.reject(new Error(message));
  }
);

export default api;
