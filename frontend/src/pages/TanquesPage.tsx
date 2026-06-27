import { useEffect, useState } from 'react';
import type { TanqueResponse, TanqueRequest } from '../types';
import { tanquesService } from '../services/tanquesService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="animate-fade-in">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tanques</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie os tanques de fermentação</p>
        </div>
        {!mostrarForm && (
          <Button onClick={() => { setMostrarForm(true); setErro(''); setSucesso(''); }}>
            + Novo Tanque
          </Button>
        )}
      </div>

      {erro && <p className="mb-4 text-sm text-(--color-red)">{erro}</p>}
      {sucesso && <p className="mb-4 text-sm font-semibold text-(--color-green)">{sucesso}</p>}

      {mostrarForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editandoId ? 'Editar Tanque' : 'Novo Tanque'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Nome</label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Capacidade (litros)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.capacidade || ''}
                  onChange={(e) => setForm({ ...form, capacidade: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={salvar} disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button variant="outline" onClick={cancelar}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {carregando ? <LoadingSpinner /> : (
        <>
          {tanques.length > 0 && (
            <p className="mb-2 text-sm text-muted-foreground">
              {tanques.length} {tanques.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
            </p>
          )}
          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-(--color-primary) hover:bg-(--color-primary)">
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Capacidade (L)</TableHead>
                  <TableHead className="w-50 text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tanques.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Nenhum tanque cadastrado. Clique em <strong>+ Novo Tanque</strong> para começar.
                    </TableCell>
                  </TableRow>
                ) : tanques.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.nome}</TableCell>
                    <TableCell>{t.capacidade}</TableCell>
                    <TableCell>
                      {confirmandoExclusao === t.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-(--color-red)">Confirmar?</span>
                          <Button size="sm" variant="destructive" onClick={() => remover(t.id)}>Sim</Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirmandoExclusao(null)}>Não</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editar(t)}>Editar</Button>
                          <Button size="sm" variant="destructive" onClick={() => setConfirmandoExclusao(t.id)}>Remover</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
