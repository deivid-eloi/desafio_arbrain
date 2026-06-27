import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardResponse, RegistroResponse } from '../types';
import { dashboardService } from '../services/dashboardService';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const btnStyle: React.CSSProperties = {
  padding: '0.6rem 1.2rem', borderRadius: 4, border: 'none',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
  transition: 'all 0.2s ease', textDecoration: 'none', display: 'inline-block',
};

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardResponse | null>(null);
  const [ultimos, setUltimos] = useState<RegistroResponse[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    dashboardService.obterIndicadores()
      .then(setDados)
      .catch(() => setErro('Erro ao carregar indicadores.'));
    registrosService.listarTodos()
      .then(lista => setUltimos(lista.slice(0, 5)))
      .catch(() => {});
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
      <h1 style={{ marginBottom: '0.25rem', color: 'var(--color-gray-light)' }}>Bem-vindo ao BrewControl</h1>
      <p style={{ color: 'var(--color-gray)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        Acompanhamento de fermentação em tempo real
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: card.tint,
            borderRadius: 8, padding: '1.5rem',
            border: '1px solid var(--color-border)',
            borderTopWidth: 4, borderTopStyle: 'solid', borderTopColor: card.cor,
            transition: 'all 0.2s ease', cursor: 'default',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: '0.5rem' }}>{card.label}</p>
            <p style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--color-gray-light)' }}>{card.valor}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <Link to="/registros" style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}>
          + Novo Registro
        </Link>
        <Link to="/cervejas" style={{ ...btnStyle, background: 'transparent', color: 'var(--color-gray-light)', border: '1px solid var(--color-border)' }}>
          Gerenciar Cervejas
        </Link>
      </div>

      <h3 style={{ color: 'var(--color-gray-light)', marginBottom: '0.75rem' }}>Últimos Registros</h3>

      {ultimos.length === 0 ? (
        <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem' }}>
          Nenhum registro ainda. Acesse <Link to="/registros" style={{ color: 'var(--color-yellow)' }}>Registros</Link> para criar o primeiro.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 8, overflow: 'hidden', fontSize: '0.85rem', border: '1px solid var(--color-border)' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.75rem' }}>Data/Hora</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Cerveja</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Tanque</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Lote</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Temp (°C)</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>pH</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Extrato (°P)</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Classificação</th>
            </tr>
          </thead>
          <tbody>
            {ultimos.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.5rem 0.75rem' }}>{new Date(r.dataHora).toLocaleString('pt-BR')}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.cervejaNome}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.tanqueNome}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.numeroDeLote}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.temperatura}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.ph}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.extrato}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}><ClassificacaoBadge classificacao={r.classificacao} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
