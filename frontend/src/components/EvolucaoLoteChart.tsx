import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { RegistroResponse, ParametrosResponse } from '../types';

// Cores da paleta ArBrain por métrica (mesmas usadas na classificação).
const COR_TEMPERATURA = '#FA9897'; // --color-red
const COR_PH = '#FFC524'; // --color-yellow
const COR_EXTRATO = '#9CDA97'; // --color-green

interface EvolucaoLoteChartProps {
  registros: RegistroResponse[];
  parametros: ParametrosResponse | null;
}

// Formata a data/hora do apontamento como dd/MM HH:mm para o eixo X.
function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EvolucaoLoteChart({ registros, parametros }: EvolucaoLoteChartProps) {
  // Ordena cronologicamente (defensivo — a API já retorna ordenado por DataHora)
  // e projeta apenas os campos do gráfico, sem nova chamada à API.
  const dados = [...registros]
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
    .map((r) => ({
      data: formatarDataHora(r.dataHora),
      temperatura: r.temperatura,
      ph: r.ph,
      extrato: r.extrato,
    }));

  return (
    <div className="mb-4 rounded-xl bg-[#252535] p-4 ring-1 ring-foreground/10">
      <h3 className="mb-4 text-base font-semibold text-foreground">Evolução do Lote</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dados} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="data" stroke="#acbbcd" tick={{ fontSize: 12 }} />

          {/* Um eixo Y por métrica — escalas auto-ajustadas independentes, pois
              temperatura (~10-25 °C) e pH/extrato (~2-5) têm ordens de grandeza distintas. */}
          <YAxis
            yAxisId="temperatura"
            orientation="left"
            stroke={COR_TEMPERATURA}
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            width={40}
          />
          <YAxis
            yAxisId="ph"
            orientation="right"
            stroke={COR_PH}
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            width={40}
          />
          <YAxis
            yAxisId="extrato"
            orientation="right"
            stroke={COR_EXTRATO}
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            width={40}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: '#1D1D2D',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
            }}
            labelStyle={{ color: '#E8E8E8' }}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />

          {/* Faixas de referência (mín/máx dos parâmetros da cerveja), quando cadastrados. */}
          {parametros && (
            <>
              <ReferenceLine yAxisId="temperatura" y={parametros.temperaturaMinima} stroke={COR_TEMPERATURA} strokeDasharray="4 4" strokeOpacity={0.5} ifOverflow="extendDomain" />
              <ReferenceLine yAxisId="temperatura" y={parametros.temperaturaMaxima} stroke={COR_TEMPERATURA} strokeDasharray="4 4" strokeOpacity={0.5} ifOverflow="extendDomain" />
              <ReferenceLine yAxisId="ph" y={parametros.phMinimo} stroke={COR_PH} strokeDasharray="4 4" strokeOpacity={0.5} ifOverflow="extendDomain" />
              <ReferenceLine yAxisId="ph" y={parametros.phMaximo} stroke={COR_PH} strokeDasharray="4 4" strokeOpacity={0.5} ifOverflow="extendDomain" />
              <ReferenceLine yAxisId="extrato" y={parametros.extratoPMinimo} stroke={COR_EXTRATO} strokeDasharray="4 4" strokeOpacity={0.5} ifOverflow="extendDomain" />
              <ReferenceLine yAxisId="extrato" y={parametros.extratoPMaximo} stroke={COR_EXTRATO} strokeDasharray="4 4" strokeOpacity={0.5} ifOverflow="extendDomain" />
            </>
          )}

          <Line yAxisId="temperatura" type="monotone" dataKey="temperatura" name="Temperatura (°C)" stroke={COR_TEMPERATURA} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line yAxisId="ph" type="monotone" dataKey="ph" name="pH" stroke={COR_PH} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          <Line yAxisId="extrato" type="monotone" dataKey="extrato" name="Extrato (°P)" stroke={COR_EXTRATO} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
