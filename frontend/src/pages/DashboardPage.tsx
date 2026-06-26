import { useEffect, useState } from 'react';
import type { DashboardResponse } from '../types';
import { dashboardService } from '../services/dashboardService';

// Cards com totais de registros por classificação.
// Cores dos cards seguem o design system (verde/amarelo/vermelho).
export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardResponse | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    dashboardService.obterIndicadores()
      .then(setDados)
      .catch(() => setErro('Erro ao carregar indicadores.'));
  }, []);

  if (erro) return <p style={{ color: 'var(--color-red)' }}>{erro}</p>;
  if (!dados) return <p>Carregando...</p>;

  const cards = [
    { label: 'Total de Registros', valor: dados.totalRegistros, cor: 'var(--color-secondary)' },
    { label: 'Dentro do Padrão', valor: dados.dentroDopadrao, cor: 'var(--color-green)' },
    { label: 'Atenção', valor: dados.atencao, cor: 'var(--color-yellow)' },
    { label: 'Fora do Padrão', valor: dados.foraDoPadrao, cor: 'var(--color-red)' },
  ];

  return (
    <>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: '#fff',
            borderRadius: 8,
            padding: '1.25rem',
            borderLeft: `5px solid ${card.cor}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '0.4rem' }}>
              {card.label}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
              {card.valor}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
