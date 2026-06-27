import { useEffect, useState } from 'react';
import type { CervejaResponse, CervejaRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
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

export default function CervejasPage() {
  const [cervejas, setCervejas] = useState<CervejaResponse[]>([]);
  const [form, setForm] = useState<CervejaRequest>({ nome: '', estilo: '' });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<number | null>(null);

  const carregar = () => {
    setCarregando(true);
    cervejasService.listarTodas()
      .then(setCervejas)
      .catch(() => setErro('Erro ao carregar cervejas.'))
      .finally(() => setCarregando(false));
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (editandoId) {
        await cervejasService.atualizar(editandoId, form);
      } else {
        await cervejasService.criar(form);
      }
      setForm({ nome: '', estilo: '' });
      setEditandoId(null);
      setMostrarForm(false);
      setSucesso('Salvo com sucesso!');
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch {
      setErro('Erro ao salvar cerveja.');
    } finally {
      setSalvando(false);
    }
  };

  const editar = (c: CervejaResponse) => {
    setForm({ nome: c.nome, estilo: c.estilo });
    setEditandoId(c.id);
    setMostrarForm(true);
    setErro('');
    setSucesso('');
  };

  const remover = async (id: number) => {
    setErro('');
    try {
      await cervejasService.remover(id);
      setConfirmandoExclusao(null);
      carregar();
    } catch {
      setErro('Erro ao remover. Verifique se há registros vinculados.');
      setConfirmandoExclusao(null);
    }
  };

  const cancelar = () => {
    setForm({ nome: '', estilo: '' });
    setEditandoId(null);
    setMostrarForm(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'var(--color-gray-light)' }}>Cervejas</h1>
        {!mostrarForm && (
          <button onClick={() => { setMostrarForm(true); setErro(''); setSucesso(''); }}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}>
            + Nova Cerveja
          </button>
        )}
      </div>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'var(--color-green)', marginBottom: '1rem', fontWeight: 600 }}>{sucesso}</p>}

      {mostrarForm && (
        <div style={{
          background: 'var(--color-surface)',
          padding: '1.25rem', borderRadius: 8, marginBottom: '1.5rem',
          border: '1px solid var(--color-border)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-gray-light)' }}>
            {editandoId ? 'Editar Cerveja' : 'Nova Cerveja'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Nome</label>
              <input style={inputStyle} value={form.nome}
                onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Estilo</label>
              <input style={inputStyle} value={form.estilo}
                onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                onChange={e => setForm({ ...form, estilo: e.target.value })} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={salvar} disabled={salvando}
              style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff', opacity: salvando ? 0.6 : 1 }}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button onClick={cancelar}
              style={{ ...btnStyle, background: 'transparent', color: 'var(--color-gray)', border: '1px solid var(--color-border)' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {carregando ? <LoadingSpinner /> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '0.6rem 1rem' }}>ID</th>
              <th style={{ padding: '0.6rem 1rem' }}>Nome</th>
              <th style={{ padding: '0.6rem 1rem' }}>Estilo</th>
              <th style={{ padding: '0.6rem 1rem', width: 180 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cervejas.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray)' }}>
                Nenhuma cerveja cadastrada. Clique em <strong>+ Nova Cerveja</strong> para começar.
              </td></tr>
            ) : cervejas.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.5rem 1rem' }}>{c.id}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{c.nome}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{c.estilo}</td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  {confirmandoExclusao === c.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-red)' }}>Confirmar?</span>
                      <button onClick={() => remover(c.id)}
                        style={{ ...btnStyle, background: 'var(--color-red)', color: '#1a1a1a', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        Sim
                      </button>
                      <button onClick={() => setConfirmandoExclusao(null)}
                        style={{ ...btnStyle, background: 'transparent', color: 'var(--color-gray)', fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid var(--color-border)' }}>
                        Não
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => editar(c)}
                        style={{ ...btnStyle, background: 'var(--color-yellow)', color: '#1a1a1a', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        Editar
                      </button>
                      <button onClick={() => setConfirmandoExclusao(c.id)}
                        style={{ ...btnStyle, background: 'var(--color-red)', color: '#1a1a1a', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        Remover
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
