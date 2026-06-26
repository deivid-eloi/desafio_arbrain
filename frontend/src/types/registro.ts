export interface RegistroRequest {
  dataHora: string;
  cervejaId: number;
  tanqueId: number;
  numeroDeLote: string;
  temperatura: number;
  ph: number;
  extrato: number;
  observacoes?: string;
}

export interface RegistroResponse {
  id: number;
  dataHora: string;
  cervejaId: number;
  cervejaNome: string;
  tanqueId: number;
  tanqueNome: string;
  numeroDeLote: string;
  temperatura: number;
  ph: number;
  extrato: number;
  observacoes: string | null;
  classificacao: string;
}
