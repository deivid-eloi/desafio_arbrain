import { useEffect, useState } from 'react';
import type { CervejaResponse, TanqueResponse, RegistroResponse, RegistroRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
import { tanquesService } from '../services/tanquesService';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem', borderRadius: 4,
  border: '1px solid var(--color-border)', fontFamily: 'inherit', fontSize: '0.9rem',
  background: 'var(--color-bg)', color: 'var(--color-gray-light)',
  outline: 'none', transition: 'border-color 0.2s ease',
};

const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', borderRadius: 4, border: 'none',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
  transition: 'all 0.2s ease',
};

const formVazio: RegistroRequest = {
  dataHora: '', cervejaId: 0, tanqueId: 0, numeroDeLote: '',
  temperatura: 0, ph: 0, extrato: 0, observacoes: '',
};

export default function RegistrosPage() {
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [cervejas, setCervejas] = useState<CervejaResponse[]>([]);
  const [tanques, setTanques] = useState<TanqueResponse[]>([]);
  const [form, setForm] = useState<RegistroRequest>(formVazio);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregar = () => {
    setCarregando(true);
    registrosService.listarTodos()
      .then(setRegistros)
      .catch(() => setErro('Erro ao carregar registros.'))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    cervejasService.listarTodas().then(setCervejas).catch(() => setErro('Erro ao carregar dados.'));
    tanquesService.listarTodos().then(setTanques).catch(() => setErro('Erro ao carregar dados.'));
    carregar();
  }, []);

  const salvar = async () => {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      await registrosService.criar({
        ...form,
        dataHora: form.dataHora || new Date().toISOString(),
      });
      setSucesso('Salvo com sucesso!');
      setForm(formVazio);
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch (e: unknown) {
      const resp = (e as { response?: { data?: Record<string, unknown> | string } })?.response;
      const data = resp?.data;
      const mensagem = typeof data === 'string'
        ? data
        : (data as { detail?: string } | undefined)?.detail;
      setErro(mensagem || 'Erro ao criar registro.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>Registros de Fermentação</h1>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'var(--color-green)', marginBottom: '1rem', fontWeight: 600 }}>{sucesso}</p>}

      <div style={{
        background: 'var(--color-surface)',
        padding: '1.25rem', borderRadius: 8, marginBottom: '1.5rem',
        border: '1px solid var(--color-border)',
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>Novo Registro</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Cerveja</label>
            <select style={inputStyle} value={form.cervejaId || ''}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, cervejaId: parseInt(e.target.value) || 0 })}>
              <option value="">— Selecione —</option>
              {cervejas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Tanque</label>
            <select style={inputStyle} value={form.tanqueId || ''}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, tanqueId: parseInt(e.target.value) || 0 })}>
              <option value="">— Selecione —</option>
              {tanques.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Nº do Lote</label>
            <input style={inputStyle} value={form.numeroDeLote}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, numeroDeLote: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Data/Hora</label>
            <input type="datetime-local" style={inputStyle} value={form.dataHora}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, dataHora: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Temperatura (°C)</label>
            <input type="number" step="0.1" style={inputStyle} value={form.temperatura || ''}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, temperatura: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>pH</label>
            <input type="number" step="0.01" style={inputStyle} value={form.ph || ''}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, ph: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Extrato (°P)</label>
            <input type="number" step="0.01" style={inputStyle} value={form.extrato || ''}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, extrato: parseFloat(e.target.value) || 0 })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Observações</label>
            <input style={inputStyle} value={form.observacoes ?? ''}
              onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
              onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
              onChange={e => setForm({ ...form, observacoes: e.target.value })} />
          </div>
        </div>

        <button onClick={salvar} disabled={salvando}
          style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff', marginTop: '1rem', opacity: salvando ? 0.6 : 1 }}>
          {salvando ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </div>

      <h3 style={{ color: 'var(--color-gray-light)', marginBottom: '0.75rem' }}>Registros Recentes</h3>

      {carregando ? <LoadingSpinner /> : (
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
            {registros.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray)' }}>
                Nenhum registro encontrado. Preencha o formulário acima para criar o primeiro.
              </td></tr>
            ) : registros.map(r => (
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
