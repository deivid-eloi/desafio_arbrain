import { useState } from 'react';
import type { RegistroResponse } from '../types';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const inputStyle: React.CSSProperties = {
  padding: '0.5rem', borderRadius: 4,
  border: '1px solid var(--color-border)', fontFamily: 'inherit', fontSize: '0.9rem',
  background: 'var(--color-bg)', color: 'var(--color-gray-light)',
  outline: 'none', transition: 'border-color 0.2s ease',
};

const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', borderRadius: 4, border: 'none',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
  transition: 'all 0.2s ease',
};

export default function HistoricoLotesPage() {
  const [lote, setLote] = useState('');
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);

  const buscar = async () => {
    if (!lote.trim()) return;
    setErro('');
    setBuscou(false);
    setBuscando(true);
    try {
      const dados = await registrosService.obterPorLote(lote.trim());
      setRegistros(dados);
      setBuscou(true);
    } catch {
      setErro('Erro ao buscar registros do lote.');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>Histórico de Lotes</h1>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input style={{ ...inputStyle, width: 300 }}
          placeholder="Número do Lote (ex: LOTE-001)"
          value={lote}
          onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          onChange={e => setLote(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') buscar(); }} />
        <button onClick={buscar} disabled={buscando}
          style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff', opacity: buscando ? 0.6 : 1 }}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {buscando && <LoadingSpinner />}

      {buscou && registros.length === 0 && (
        <p style={{ color: 'var(--color-gray)' }}>Nenhum registro encontrado para o lote "{lote}".</p>
      )}

      {registros.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 8, overflow: 'hidden', fontSize: '0.85rem', border: '1px solid var(--color-border)' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '0.5rem 0.75rem' }}>Data/Hora</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Cerveja</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Tanque</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Temp (°C)</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>pH</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Extrato (°P)</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Observações</th>
              <th style={{ padding: '0.5rem 0.75rem' }}>Classificação</th>
            </tr>
          </thead>
          <tbody>
            {registros.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.5rem 0.75rem' }}>{new Date(r.dataHora).toLocaleString('pt-BR')}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.cervejaNome}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.tanqueNome}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.temperatura}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.ph}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.extrato}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}>{r.observacoes ?? '—'}</td>
                <td style={{ padding: '0.5rem 0.75rem' }}><ClassificacaoBadge classificacao={r.classificacao} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
