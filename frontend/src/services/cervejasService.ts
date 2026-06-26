import api from './api';
import type { CervejaRequest, CervejaResponse } from '../types';

export const cervejasService = {
  listarTodas: () =>
    api.get<CervejaResponse[]>('/cervejas').then(r => r.data),

  obterPorId: (id: number) =>
    api.get<CervejaResponse>(`/cervejas/${id}`).then(r => r.data),

  criar: (data: CervejaRequest) =>
    api.post<CervejaResponse>('/cervejas', data).then(r => r.data),

  atualizar: (id: number, data: CervejaRequest) =>
    api.put<CervejaResponse>(`/cervejas/${id}`, data).then(r => r.data),

  remover: (id: number) =>
    api.delete(`/cervejas/${id}`),
};
