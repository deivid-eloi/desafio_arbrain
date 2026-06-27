import { useEffect, useState } from 'react';
import type { TanqueResponse, TanqueRequest } from '../types';
import { tanquesService } from '../services/tanquesService';
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

export default function TanquesPage() {
  const [tanques, setTanques] = useState<TanqueResponse[]>([]);
  const [form, setForm] = useState<TanqueRequest>({ nome: '', capacidade: 0 });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState<number | null>(null);

  const carregar = () => {
    setCarregando(true);
    tanquesService.listarTodos()
      .then(setTanques)
      .catch(() => setErro('Erro ao carregar tanques.'))
      .finally(() => setCarregando(false));
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    setErro('');
    setSucesso('');
    setSalvando(true);
    try {
      if (editandoId) {
        await tanquesService.atualizar(editandoId, form);
      } else {
        await tanquesService.criar(form);
      }
      setForm({ nome: '', capacidade: 0 });
      setEditandoId(null);
      setMostrarForm(false);
      setSucesso('Salvo com sucesso!');
      carregar();
      setTimeout(() => setSucesso(''), 3000);
    } catch {
      setErro('Erro ao salvar tanque.');
    } finally {
      setSalvando(false);
    }
  };

  const editar = (t: TanqueResponse) => {
    setForm({ nome: t.nome, capacidade: t.capacidade });
    setEditandoId(t.id);
    setMostrarForm(true);
    setErro('');
    setSucesso('');
  };

  const remover = async (id: number) => {
    setErro('');
    try {
      await tanquesService.remover(id);
      setConfirmandoExclusao(null);
      carregar();
    } catch {
      setErro('Erro ao remover. Verifique se há registros vinculados.');
      setConfirmandoExclusao(null);
    }
  };

  const cancelar = () => {
    setForm({ nome: '', capacidade: 0 });
    setEditandoId(null);
    setMostrarForm(false);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-gray-light)', marginBottom: '0.25rem' }}>Tanques</h1>
          <p style={{ color: 'var(--color-gray)', fontSize: '0.9rem', marginBottom: '1rem' }}>Gerencie os tanques de fermentação</p>
        </div>
        {!mostrarForm && (
          <button onClick={() => { setMostrarForm(true); setErro(''); setSucesso(''); }}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff', marginTop: '0.25rem' }}>
            + Novo Tanque
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
            {editandoId ? 'Editar Tanque' : 'Novo Tanque'}
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
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Capacidade (litros)</label>
              <input type="number" step="0.01" style={inputStyle} value={form.capacidade || ''}
                onFocus={e => e.target.style.borderColor = 'var(--color-yellow)'}
                onBlur={e => e.target.style.borderColor = 'var(--color-border)'}
                onChange={e => setForm({ ...form, capacidade: parseFloat(e.target.value) || 0 })} />
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

      {carregando ? <LoadingSpinner /> : (<>
        {tanques.length > 0 && (
          <p style={{ color: 'var(--color-gray)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            {tanques.length} {tanques.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
          </p>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--color-surface)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <thead>
            <tr style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'left' }}>
              <th style={{ padding: '0.6rem 1rem' }}>ID</th>
              <th style={{ padding: '0.6rem 1rem' }}>Nome</th>
              <th style={{ padding: '0.6rem 1rem' }}>Capacidade (L)</th>
              <th style={{ padding: '0.6rem 1rem', width: 180 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tanques.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-gray)' }}>
                Nenhum tanque cadastrado. Clique em <strong>+ Novo Tanque</strong> para começar.
              </td></tr>
            ) : tanques.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '0.5rem 1rem' }}>{t.id}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{t.nome}</td>
                <td style={{ padding: '0.5rem 1rem' }}>{t.capacidade}</td>
                <td style={{ padding: '0.5rem 1rem' }}>
                  {confirmandoExclusao === t.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-red)' }}>Confirmar?</span>
                      <button onClick={() => remover(t.id)}
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
                      <button onClick={() => editar(t)}
                        style={{ ...btnStyle, background: 'var(--color-yellow)', color: '#1a1a1a', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                        Editar
                      </button>
                      <button onClick={() => setConfirmandoExclusao(t.id)}
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
      </>)}
    </div>
  );
}
