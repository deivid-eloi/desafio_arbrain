import { useEffect, useState } from 'react';
import type { CervejaResponse, CervejaRequest } from '../types';
import { cervejasService } from '../services/cervejasService';

// Estilo base reutilizado nos inputs de todos os formulários.
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem',
  borderRadius: 4,
  border: '1px solid var(--color-gray)',
  fontFamily: 'inherit',
  fontSize: '0.9rem',
};

const btnStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: 4,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontWeight: 600,
  fontSize: '0.85rem',
};

export default function CervejasPage() {
  const [cervejas, setCervejas] = useState<CervejaResponse[]>([]);
  const [form, setForm] = useState<CervejaRequest>({ nome: '', estilo: '' });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = () => {
    cervejasService.listarTodas()
      .then(setCervejas)
      .catch(() => setErro('Erro ao carregar cervejas.'));
  };

  useEffect(() => { carregar(); }, []);

  const salvar = async () => {
    try {
      if (editandoId) {
        await cervejasService.atualizar(editandoId, form);
      } else {
        await cervejasService.criar(form);
      }
      setForm({ nome: '', estilo: '' });
      setEditandoId(null);
      setMostrarForm(false);
      carregar();
    } catch {
      setErro('Erro ao salvar cerveja.');
    }
  };

  const editar = (c: CervejaResponse) => {
    setForm({ nome: c.nome, estilo: c.estilo });
    setEditandoId(c.id);
    setMostrarForm(true);
  };

  const remover = async (id: number) => {
    if (!confirm('Remover esta cerveja?')) return;
    try {
      await cervejasService.remover(id);
      carregar();
    } catch {
      setErro('Erro ao remover. Verifique se há registros vinculados.');
    }
  };

  const cancelar = () => {
    setForm({ nome: '', estilo: '' });
    setEditandoId(null);
    setMostrarForm(false);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Cervejas</h1>
        {!mostrarForm && (
          <button onClick={() => setMostrarForm(true)}
            style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}>
            + Nova Cerveja
          </button>
        )}
      </div>

      {erro && <p style={{ color: 'var(--color-red)', marginBottom: '1rem' }}>{erro}</p>}

      {/* Formulário de criação/edição */}
      {mostrarForm && (
        <div style={{
          background: '#fff',
          padding: '1.25rem',
          borderRadius: 8,
          marginBottom: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>
            {editandoId ? 'Editar Cerveja' : 'Nova Cerveja'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Nome</label>
              <input style={inputStyle} value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--color-gray)' }}>Estilo</label>
              <input style={inputStyle} value={form.estilo}
                onChange={e => setForm({ ...form, estilo: e.target.value })} />
            </div>
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={salvar}
              style={{ ...btnStyle, background: 'var(--color-primary)', color: '#fff' }}>
              Salvar
            </button>
            <button onClick={cancelar}
              style={{ ...btnStyle, background: 'var(--color-gray-light)', color: 'var(--color-primary)' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Tabela de cervejas */}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: 'var(--color-primary)', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '0.6rem 1rem' }}>ID</th>
            <th style={{ padding: '0.6rem 1rem' }}>Nome</th>
            <th style={{ padding: '0.6rem 1rem' }}>Estilo</th>
            <th style={{ padding: '0.6rem 1rem', width: 140 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cervejas.length === 0 ? (
            <tr><td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-gray)' }}>Nenhuma cerveja cadastrada.</td></tr>
          ) : cervejas.map(c => (
            <tr key={c.id} style={{ borderBottom: '1px solid var(--color-gray-light)' }}>
              <td style={{ padding: '0.5rem 1rem' }}>{c.id}</td>
              <td style={{ padding: '0.5rem 1rem' }}>{c.nome}</td>
              <td style={{ padding: '0.5rem 1rem' }}>{c.estilo}</td>
              <td style={{ padding: '0.5rem 1rem' }}>
                <button onClick={() => editar(c)}
                  style={{ ...btnStyle, background: 'var(--color-yellow)', color: '#1a1a1a', marginRight: 4, fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                  Editar
                </button>
                <button onClick={() => remover(c.id)}
                  style={{ ...btnStyle, background: 'var(--color-red)', color: '#1a1a1a', fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}>
                  Remover
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
