import api from './api';
import type { Feedback, FeedbackRequest, FeedbackResumo, TipoFeedbackAlvo } from '@/types';

export const feedbackService = {
  criar: (data: FeedbackRequest) =>
    api.post<Feedback>('/feedback', data).then((r) => r.data),

  listarPorEntidade: (tipoAlvo: TipoFeedbackAlvo, entidadeId: number) =>
    api.get<Feedback[]>('/feedback/publicos', { params: { tipoAlvo, entidadeId } }).then((r) => r.data),

  resumoPorEntidade: (tipoAlvo: TipoFeedbackAlvo, entidadeId: number) =>
    api.get<FeedbackResumo>('/feedback/resumo', { params: { tipoAlvo, entidadeId } }).then((r) => r.data),

  listarRecentes: () =>
    api.get<Feedback[]>('/feedback/recentes').then((r) => r.data),

  listarTodosAdmin: () =>
    api.get<Feedback[]>('/admin/feedback').then((r) => r.data),

  resumoAdmin: () =>
    api.get<FeedbackResumo>('/admin/feedback/resumo').then((r) => r.data),
};
