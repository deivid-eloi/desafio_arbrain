import { useEffect, useState } from 'react';
import type { DashboardResponse } from '../types';
import { dashboardService } from '../services/dashboardService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardResponse | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    dashboardService.obterIndicadores()
      .then(setDados)
      .catch(() => setErro('Erro ao carregar indicadores.'));
  }, []);

  if (erro) return <p style={{ color: 'var(--color-red)' }}>{erro}</p>;
  if (!dados) return <LoadingSpinner />;

  const cards = [
    { label: 'Total de Registros', valor: dados.totalRegistros, cor: 'var(--color-secondary)', tint: 'rgba(172,187,205,0.08)' },
    { label: 'Dentro do Padrão', valor: dados.dentroDopadrao, cor: 'var(--color-green)', tint: 'rgba(156,218,151,0.08)' },
    { label: 'Atenção', valor: dados.atencao, cor: 'var(--color-yellow)', tint: 'rgba(255,197,36,0.08)' },
    { label: 'Fora do Padrão', valor: dados.foraDoPadrao, cor: 'var(--color-red)', tint: 'rgba(250,152,151,0.08)' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ marginBottom: '1.5rem', color: 'var(--color-gray-light)' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: card.tint,
            borderRadius: 8,
            padding: '1.5rem',
            borderTop: `4px solid ${card.cor}`,
            border: '1px solid var(--color-border)',
            borderTopWidth: 4,
            borderTopStyle: 'solid',
            borderTopColor: card.cor,
            transition: 'all 0.2s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '0.5rem' }}>
              {card.label}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-gray-light)' }}>
              {card.valor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
