import api from './api';
import type { ParametrosRequest, ParametrosResponse } from '../types';

export const parametrosService = {
  obterPorCerveja: (cervejaId: number) =>
    api.get<ParametrosResponse>(`/cervejas/${cervejaId}/parametros`).then(r => r.data),

  criar: (cervejaId: number, data: ParametrosRequest) =>
    api.post<ParametrosResponse>(`/cervejas/${cervejaId}/parametros`, data).then(r => r.data),

  atualizar: (cervejaId: number, data: ParametrosRequest) =>
    api.put<ParametrosResponse>(`/cervejas/${cervejaId}/parametros`, data).then(r => r.data),
};
