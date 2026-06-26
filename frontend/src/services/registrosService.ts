import api from './api';
import type { RegistroRequest, RegistroResponse } from '../types';

export const registrosService = {
  listarTodos: () =>
    api.get<RegistroResponse[]>('/registros').then(r => r.data),

  obterPorId: (id: number) =>
    api.get<RegistroResponse>(`/registros/${id}`).then(r => r.data),

  obterPorLote: (numeroDeLote: string) =>
    api.get<RegistroResponse[]>(`/registros/lote/${encodeURIComponent(numeroDeLote)}`).then(r => r.data),

  criar: (data: RegistroRequest) =>
    api.post<RegistroResponse>('/registros', data).then(r => r.data),
};
