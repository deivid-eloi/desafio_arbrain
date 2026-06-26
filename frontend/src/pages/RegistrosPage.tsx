import { useEffect, useState } from 'react';
import type { CervejaResponse, TanqueResponse, RegistroResponse, RegistroRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
import { tanquesService } from '../services/tanquesService';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem', borderRadius: 4,
  border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '0.9rem',
};
const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', borderRadius: 4, border: 'none',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
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

  const carregar = () => {
    registrosService.listarTodos().then(setRegistros).catch(() => {});
  };

  useEffect(() => {
    cervejasService.listarTodas().then(setCervejas).catch(() => {});
    tanquesService.listarTodos().then(setTanques).catch(() => {});
    carregar();
  }, []);

  const salvar = async () => {
    setErro('');
    setSucesso('');
    try {
      await registrosService.criar({
        ...form,
        dataHora: form.dataHora || new Date().toISOString(),
      });
      setSucesso('Registro criado com sucesso.');
      setForm(formVazio);
      carregar();
    } catch (e: unknown) {
      // Mensagem de erro do backend (ex: cerveja sem parâmetros).
      if (e && typeof e === 'object' && 'response' in e) {
        const resp = (e as { response: { data: string } }).response;
        setErro(typeof resp.data === 'string' ? resp.data : 'Erro ao criar registro.');
      } else {
        setErro('Erro ao criar registro.');
      }
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Registros de Fermentação</h1>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'var(--color-green)', marginBottom: '1rem', fontWeight: 600 }}>{sucesso}</p>}

      {/* Formulário de novo registro */}
      <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 8, marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Novo Registro</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Cerveja</label>
            <select style={inputStyle} value={form.cervejaId || ''}
              onChange={e => setForm({ ...form, cervejaId: parseInt(e.target.value) || 0 })}>
              <option value="">— Selecione —</option>
              {cervejas.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Tanque</label>
            <select style={inputStyle} value={form.tanqueId || ''}
              onChange={e => setForm({ ...form, tanqueId: parseInt(e.target.value) || 0 })}>
              <option value="">— Selecione —</option>
              {tanques.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Nº do Lote</label>
            <input style={inputStyle} value={form.numeroDeLote}
              onChange={e => setForm({ ...form, numeroDeLote: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Data/Hora</label>
            <input type="datetime-local" style={inputStyle} value={form.dataHora}
              onChange={e => setForm({ ...form, dataHora: e.target.value })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Temperatura (°C)</label>
            <input type="number" step="0.1" style={inputStyle} value={form.temperatura || ''}
              onChange={e => setForm({ ...form, temperatura: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>pH</label>
            <input type="number" step="0.01" style={inputStyle} value={form.ph || ''}
              onChange={e => setForm({ ...form, ph: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Extrato (°P)</label>
            <input type="number" step="0.01" style={inputStyle} value={form.extrato || ''}
              onChange={e => setForm({ ...form, extrato: parseFloat(e.target.value) || 0 })} />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Observações</label>
            <input style={inputStyle} value={form.observacoes ?? ''}
              onChange={e => setForm({ ...form, observacoes: e.target.value })} />
          </div>
        </div>

        <button onClick={salvar} style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff', marginTop: '1rem' }}>
          Salvar Registro
        </button>
      </div>

      {/* Lista de registros recentes */}
      <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>Registros Recentes</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', fontSize: '0.85rem' }}>
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
            <tr><td colSpan={8} style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-gray)' }}>Nenhum registro encontrado.</td></tr>
          ) : registros.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
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
    </>
  );
}
