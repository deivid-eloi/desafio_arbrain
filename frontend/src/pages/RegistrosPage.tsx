import { useEffect, useState } from 'react';
import type { CervejaResponse, TanqueResponse, RegistroResponse, RegistroRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
import { tanquesService } from '../services/tanquesService';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Registros de Fermentação</h1>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">Registre e acompanhe as leituras de fermentação</p>

      {erro && <p className="mb-4 text-sm text-(--color-red)">{erro}</p>}
      {sucesso && <p className="mb-4 text-sm font-semibold text-(--color-green)">{sucesso}</p>}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Novo Registro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Cerveja</label>
              <Select
                value={form.cervejaId ? String(form.cervejaId) : undefined}
                onValueChange={(v) => setForm({ ...form, cervejaId: parseInt(v) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="— Selecione —" />
                </SelectTrigger>
                <SelectContent>
                  {cervejas.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Tanque</label>
              <Select
                value={form.tanqueId ? String(form.tanqueId) : undefined}
                onValueChange={(v) => setForm({ ...form, tanqueId: parseInt(v) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="— Selecione —" />
                </SelectTrigger>
                <SelectContent>
                  {tanques.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>{t.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Nº do Lote</label>
              <Input value={form.numeroDeLote} onChange={(e) => setForm({ ...form, numeroDeLote: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Data/Hora</label>
              <Input
                type="datetime-local"
                value={form.dataHora}
                onChange={(e) => setForm({ ...form, dataHora: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Temperatura (°C)</label>
              <Input
                type="number"
                step="0.1"
                value={form.temperatura || ''}
                onChange={(e) => setForm({ ...form, temperatura: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">pH</label>
              <Input
                type="number"
                step="0.01"
                value={form.ph || ''}
                onChange={(e) => setForm({ ...form, ph: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-muted-foreground">Extrato (°P)</label>
              <Input
                type="number"
                step="0.01"
                value={form.extrato || ''}
                onChange={(e) => setForm({ ...form, extrato: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm text-muted-foreground">Observações</label>
              <Textarea
                rows={2}
                value={form.observacoes ?? ''}
                onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={salvar} disabled={salvando} className="mt-4">
            {salvando ? 'Salvando...' : 'Salvar Registro'}
          </Button>
        </CardContent>
      </Card>

      <div className="mb-5 rounded-lg border border-(--color-yellow)/15 bg-(--color-yellow)/10 px-4 py-3 text-sm text-foreground">
        A classificação é calculada automaticamente com base nos parâmetros definidos para cada cerveja.
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Registros Recentes</h3>
        {registros.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {registros.length} {registros.length === 1 ? 'registro' : 'registros'}
          </span>
        )}
      </div>

      {carregando ? <LoadingSpinner /> : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-(--color-primary) hover:bg-(--color-primary)">
                <TableHead className="text-white">Data/Hora</TableHead>
                <TableHead className="text-white">Cerveja</TableHead>
                <TableHead className="text-white">Tanque</TableHead>
                <TableHead className="text-white">Lote</TableHead>
                <TableHead className="text-white">Temp (°C)</TableHead>
                <TableHead className="text-white">pH</TableHead>
                <TableHead className="text-white">Extrato (°P)</TableHead>
                <TableHead className="text-white">Classificação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    Nenhum registro encontrado. Preencha o formulário acima para criar o primeiro.
                  </TableCell>
                </TableRow>
              ) : registros.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{new Date(r.dataHora).toLocaleString('pt-BR')}</TableCell>
                  <TableCell>{r.cervejaNome}</TableCell>
                  <TableCell>{r.tanqueNome}</TableCell>
                  <TableCell>{r.numeroDeLote}</TableCell>
                  <TableCell>{r.temperatura}</TableCell>
                  <TableCell>{r.ph}</TableCell>
                  <TableCell>{r.extrato}</TableCell>
                  <TableCell><ClassificacaoBadge classificacao={r.classificacao} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
