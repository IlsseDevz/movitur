import api from './api';
import type { AuthResponse, LoginRequest, RegistoRequest, RegistoResponse, Usuario } from '@/types';

export const authService = {
  async registar(data: RegistoRequest): Promise<RegistoResponse> {
    const { data: response } = await api.post<RegistoResponse>('/auth/registo', data);
    return response;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const { data: response } = await api.post<AuthResponse>('/auth/login', data);
    return response;
  },

  async me(): Promise<Usuario> {
    const { data: response } = await api.get<Usuario>('/auth/me');
    return response;
  },

  async recuperarSenha(email: string): Promise<string> {
    const { data } = await api.post<{ mensagem: string }>('/auth/recuperar-senha', { email });
    return data.mensagem;
  },

  async redefinirSenha(token: string, novaSenha: string): Promise<string> {
    const { data } = await api.post<{ mensagem: string }>('/auth/redefinir-senha', { token, novaSenha });
    return data.mensagem;
  },

  async atualizarPerfil(telefone?: string): Promise<Usuario> {
    const { data } = await api.put<Usuario>('/auth/perfil', { telefone });
    return data;
  },

  async alterarSenha(senhaAtual: string, novaSenha: string): Promise<string> {
    const { data } = await api.put<{ mensagem: string }>('/auth/alterar-senha', { senhaAtual, novaSenha });
    return data.mensagem;
  },
};
