import { useEffect, useState } from 'react';
import type { CervejaResponse, ParametrosRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
import { parametrosService } from '../services/parametrosService';
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

const formVazio: ParametrosRequest = {
  temperaturaMinima: 0, temperaturaMaxima: 0,
  phMinimo: 0, phMaximo: 0,
  extratoPMinimo: 0, extratoPMaximo: 0,
};

export default function ParametrosPage() {
  const [cervejas, setCervejas] = useState<CervejaResponse[]>([]);
  const [cervejaId, setCervejaId] = useState<number | null>(null);
  const [form, setForm] = useState<ParametrosRequest>(formVazio);
  const [jaExiste, setJaExiste] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    cervejasService.listarTodas()
      .then(setCervejas)
      .catch(() => setErro('Erro ao carregar cervejas.'))
      .finally(() => setCarregando(false));
  }, []);

  const selecionarCerveja = async (id: number) => {
    setCervejaId(id);
    setErro('');
    setSucesso('');
    setJaExiste(false);

    try {
      const p = await parametrosService.obterPorCerveja(id);
      setJaExiste(true);
      setForm({
        temperaturaMinima: p.temperaturaMinima,
        temperaturaMaxima: p.temperaturaMaxima,
        phMinimo: p.phMinimo,
        phMaximo: p.phMaximo,
        extratoPMinimo: p.extratoPMinimo,
        extratoPMaximo: p.extratoPMaximo,
      });
    } catch {
      setForm(formVazio);
    }
  };

  const salvar = async () => {
    if (!cervejaId) return;
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (jaExiste) {
        await parametrosService.atualizar(cervejaId, form);
      } else {
        await parametrosService.criar(cervejaId, form);
        setJaExiste(true);
      }
      setSucesso('Salvo com sucesso!');
      setTimeout(() => setSucesso(''), 3000);
    } catch {
      setErro('Erro ao salvar parâmetros.');
    } finally {
      setSalvando(false);
    }
  };

  const camposParam = [
    { label: 'Temperatura (°C)', min: 'temperaturaMinima' as const, max: 'temperaturaMaxima' as const },
    { label: 'pH', min: 'phMinimo' as const, max: 'phMaximo' as const },
    { label: 'Extrato (°P)', min: 'extratoPMinimo' as const, max: 'extratoPMaximo' as const },
  ];

  if (carregando) return <LoadingSpinner />;

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <h1 style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>Parâmetros Fermentativos</h1>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'var(--color-green)', marginBottom: '1rem', fontWeight: 600 }}>{sucesso}</p>}

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)', display: 'block', marginBottom: 4 }}>
          Selecione uma cerveja
        </label>
        <select
          style={{ ...inputStyle, maxWidth: 400 }}
          value={cervejaId ?? ''}
          onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
          onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
          onChange={e => {
            const v = parseInt(e.target.value);
            if (v) selecionarCerveja(v);
          }}
        >
          <option value="">— Selecione —</option>
          {cervejas.map(c => (
            <option key={c.id} value={c.id}>{c.nome} ({c.estilo})</option>
          ))}
        </select>
      </div>

      {cervejaId && (
        <div style={{
          background: 'var(--color-surface)',
          padding: '1.25rem', borderRadius: 8,
          border: '1px solid var(--color-border)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>
            {jaExiste ? 'Editar Parâmetros' : 'Definir Parâmetros'}
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            {camposParam.map(campo => (
              <div key={campo.min}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', marginBottom: 4 }}>{campo.label}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>Mín</label>
                    <input type="number" step="0.01" style={inputStyle}
                      value={form[campo.min] || ''}
                      onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                      onChange={e => setForm({ ...form, [campo.min]: parseFloat(e.target.value) || 0 })} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--color-gray)' }}>Máx</label>
                    <input type="number" step="0.01" style={inputStyle}
                      value={form[campo.max] || ''}
                      onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
                      onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                      onChange={e => setForm({ ...form, [campo.max]: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={salvar} disabled={salvando}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff', marginTop: '1rem', opacity: salvando ? 0.6 : 1 }}>
            {salvando ? 'Salvando...' : 'Salvar Parâmetros'}
          </button>
        </div>
      )}
    </div>
  );
}
