import { useEffect, useState } from 'react';
import type { TanqueResponse, TanqueRequest } from '../types';
import { tanquesService } from '../services/tanquesService';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem', borderRadius: 4,
  border: '1px solid var(--color-gray)', fontFamily: 'inherit', fontSize: '0.9rem',
};
const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', borderRadius: 4, border: 'none',
  cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem',
};

export default function TanquesPage() {
  const [tanques, setTanques] = useState<TanqueResponse[]>([]);
  const [form, setForm] = useState<TanqueRequest>({ nome: '', capacidade: 0 });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = () => {
    tanquesService.listarTodos().then(setTanques).catch(() => setErro('Erro ao carregar tanques.'));
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    try {
      if (editandoId) {
        await tanquesService.atualizar(editandoId, form);
      } else {
        await tanquesService.criar(form);
      }
      setForm({ nome: '', capacidade: 0 });
      setEditandoId(null);
      setMostrarForm(false);
      carregar();
    } catch {
      setErro('Erro ao salvar tanque.');
    }
  };

  const editar = (t: TanqueResponse) => {
    setForm({ nome: t.nome, capacidade: t.capacidade });
    setEditandoId(t.id);
    setMostrarForm(true);
  };

  const remover = async (id: number) => {
    if (!confirm('Remover este tanque?')) return;
    try {
      await tanquesService.remover(id);
      carregar();
    } catch {
      setErro('Erro ao remover. Verifique se há registros vinculados.');
    }
  };

  const cancelar = () => {
    setForm({ nome: '', capacidade: 0 });
    setEditandoId(null);
    setMostrarForm(false);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Tanques</h1>
        {!mostrarForm && (
          <button onClick={() => setMostrarForm(true)}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}>
            + Novo Tanque
          </button>
        )}
      </div>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}

      {mostrarForm && (
        <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 8, marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
            {editandoId ? 'Editar Tanque' : 'Novo Tanque'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Nome</label>
              <input style={inputStyle} value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Capacidade (litros)</label>
              <input type="number" step="0.01" style={inputStyle} value={form.capacidade || ''}
                onChange={e => setForm({ ...form, capacidade: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={salvar} style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}>Salvar</button>
            <button onClick={cancelar} style={{ ...btnStyle, background: 'var(--color-gray-light)', color: 'var(--color-primary)' }}>Cancelar</button>
          </div>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '0.6rem 1rem' }}>ID</th>
            <th style={{ padding: '0.6rem 1rem' }}>Nome</th>
            <th style={{ padding: '0.6rem 1rem' }}>Capacidade (L)</th>
            <th style={{ padding: '0.6rem 1rem', width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {tanques.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-gray)' }}>Nenhum tanque cadastrado.</td></tr>
          ) : tanques.map(t => (
            <tr key={t.id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
              <td style={{ padding: '0.5rem 1rem' }}>{t.id}</td>
              <td style={{ padding: '0.5rem 1rem' }}>{t.nome}</td>
              <td style={{ padding: '0.5rem 1rem' }}>{t.capacidade}</td>
              <td style={{ padding: '0.5rem 1rem' }}>
                <button onClick={() => editar(t)} style={{ ...btnStyle, background: 'var(--color-yellow)', color: '#1a1a1a', marginRight: 4, fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>Editar</button>
                <button onClick={() => remover(t.id)} style={{ ...btnStyle, background: 'var(--color-red)', color: '#1a1a1a', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
