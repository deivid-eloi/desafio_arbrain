export interface ParametrosRequest {
  temperaturaMinima: number;
  temperaturaMaxima: number;
  phMinimo: number;
  phMaximo: number;
  extratoPMinimo: number;
  extratoPMaximo: number;
}

export interface ParametrosResponse {
  id: number;
  cervejaId: number;
  temperaturaMinima: number;
  temperaturaMaxima: number;
  phMinimo: number;
  phMaximo: number;
  extratoPMinimo: number;
  extratoPMaximo: number;
}
