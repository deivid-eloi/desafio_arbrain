import { useEffect, useState } from 'react';
import type { CervejaResponse, CervejaRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
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
import iconEditar from '@/assets/icons/manutencao.svg';
import iconRemover from '@/assets/icons/Frame 116.svg';

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
    <div className="animate-fade-in">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cervejas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie as cervejas e seus estilos</p>
        </div>
        {!mostrarForm && (
          <Button onClick={() => { setMostrarForm(true); setErro(''); setSucesso(''); }}>
            + Nova Cerveja
          </Button>
        )}
      </div>

      {erro && <p className="mb-4 text-sm text-(--color-red)">{erro}</p>}
      {sucesso && <p className="mb-4 text-sm font-semibold text-(--color-green)">{sucesso}</p>}

      {mostrarForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editandoId ? 'Editar Cerveja' : 'Nova Cerveja'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Nome</label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-muted-foreground">Estilo</label>
                <Input value={form.estilo} onChange={(e) => setForm({ ...form, estilo: e.target.value })} />
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
          {cervejas.length > 0 && (
            <p className="mb-2 text-sm text-muted-foreground">
              {cervejas.length} {cervejas.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
            </p>
          )}
          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-(--color-primary) hover:bg-(--color-primary)">
                  <TableHead className="text-white">ID</TableHead>
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">Estilo</TableHead>
                  <TableHead className="w-50 text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cervejas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      Nenhuma cerveja cadastrada. Clique em <strong>+ Nova Cerveja</strong> para começar.
                    </TableCell>
                  </TableRow>
                ) : cervejas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.nome}</TableCell>
                    <TableCell>{c.estilo}</TableCell>
                    <TableCell>
                      {confirmandoExclusao === c.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-(--color-red)">Confirmar?</span>
                          <Button size="sm" variant="destructive" onClick={() => remover(c.id)}>Sim</Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirmandoExclusao(null)}>Não</Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => editar(c)}>
                            <img src={iconEditar} alt="" width={16} height={16} />
                            Editar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => setConfirmandoExclusao(c.id)}>
                            <img src={iconRemover} alt="" width={16} height={16} />
                            Remover
                          </Button>
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
