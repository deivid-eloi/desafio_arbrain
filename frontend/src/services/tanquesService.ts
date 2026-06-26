import api from './api';
import type { TanqueRequest, TanqueResponse } from '../types';

export const tanquesService = {
  listarTodos: () =>
    api.get<TanqueResponse[]>('/tanques').then(r => r.data),

  obterPorId: (id: number) =>
    api.get<TanqueResponse>(`/tanques/${id}`).then(r => r.data),

  criar: (data: TanqueRequest) =>
    api.post<TanqueResponse>('/tanques', data).then(r => r.data),

  atualizar: (id: number, data: TanqueRequest) =>
    api.put<TanqueResponse>(`/tanques/${id}`, data).then(r => r.data),

  remover: (id: number) =>
    api.delete(`/tanques/${id}`),
};
