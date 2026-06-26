import api from './api';
import type { DashboardResponse } from '../types';

export const dashboardService = {
  obterIndicadores: () =>
    api.get<DashboardResponse>('/dashboard').then(r => r.data),
};
