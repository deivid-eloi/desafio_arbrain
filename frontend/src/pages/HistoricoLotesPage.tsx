import { useEffect, useState } from 'react';
import type { RegistroResponse } from '../types';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function HistoricoLotesPage() {
  const [lote, setLote] = useState('');
  const [registros, setRegistros] = useState<RegistroResponse[]>([]);
  const [buscou, setBuscou] = useState(false);
  const [erro, setErro] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [lotesDisponiveis, setLotesDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    registrosService.listarTodos()
      .then((todos) => {
        const unicos = [...new Set(todos.map((r) => r.numeroDeLote))];
        setLotesDisponiveis(unicos.sort());
      })
      .catch(() => {});
  }, []);

  const buscarLote = async (numero: string) => {
    setLote(numero);
    setErro('');
    setBuscou(false);
    setBuscando(true);
    try {
      const dados = await registrosService.obterPorLote(numero.trim());
      setRegistros(dados);
      setBuscou(true);
    } catch {
      setErro('Erro ao buscar registros do lote.');
    } finally {
      setBuscando(false);
    }
  };

  const buscar = async () => {
    if (!lote.trim()) return;
    setErro('');
    setBuscou(false);
    setBuscando(true);
    try {
      const dados = await registrosService.obterPorLote(lote.trim());
      setRegistros(dados);
      setBuscou(true);
    } catch {
      setErro('Erro ao buscar registros do lote.');
    } finally {
      setBuscando(false);
    }
  };

  const dentro = registros.filter((r) => r.classificacao === 'DentroDopadrao').length;
  const atencao = registros.filter((r) => r.classificacao === 'Atencao').length;
  const fora = registros.filter((r) => r.classificacao === 'ForaDoPadrao').length;

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Histórico de Lotes</h1>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">
        Consulte o histórico completo de apontamentos por lote
      </p>

      {erro && <p className="mb-4 text-sm text-(--color-red)">{erro}</p>}

      <div className="mb-2 flex gap-2">
        <Input
          className="w-75"
          placeholder="Número do Lote (ex: LOTE-001)"
          value={lote}
          onChange={(e) => setLote(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') buscar(); }}
        />
        <Button onClick={buscar} disabled={buscando}>
          {buscando ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {!buscou && !buscando && (
        <p className="mb-3 text-sm text-muted-foreground">
          Digite o número do lote para visualizar todos os apontamentos fermentativos registrados.
        </p>
      )}

      {lotesDisponiveis.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Lotes disponíveis:</span>
          {lotesDisponiveis.map((l) => (
            <Button
              key={l}
              size="sm"
              variant={lote === l ? 'default' : 'outline'}
              onClick={() => buscarLote(l)}
              className={cn(
                'rounded-full',
                lote === l
                  ? 'bg-(--color-yellow) text-[#1a1a1a] hover:bg-(--color-yellow)/90'
                  : 'border-(--color-yellow)/30 text-(--color-yellow) hover:bg-(--color-yellow)/10 hover:text-(--color-yellow)',
              )}
            >
              {l}
            </Button>
          ))}
        </div>
      )}

      {buscando && <LoadingSpinner />}

      {buscou && registros.length === 0 && (
        <p className="mt-4 text-muted-foreground">Nenhum registro encontrado para o lote "{lote}".</p>
      )}

      {buscou && registros.length > 0 && (
        <>
          <Card className="mt-4 mb-4">
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">Lote</p>
                  <p className="font-semibold text-(--color-yellow)">{registros[0].numeroDeLote}</p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">Cerveja</p>
                  <p className="text-foreground">{registros[0].cervejaNome}</p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">Tanque</p>
                  <p className="text-foreground">{registros[0].tanqueNome}</p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">Total</p>
                  <p className="font-semibold text-foreground">{registros.length} registros</p>
                </div>
                <div>
                  <p className="mb-0.5 text-xs text-muted-foreground">Classificação</p>
                  <p className="text-sm">
                    <span className="text-(--color-green)">{dentro} dentro</span>
                    {' · '}
                    <span className="text-(--color-yellow)">{atencao} atenção</span>
                    {' · '}
                    <span className="text-(--color-red)">{fora} fora</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow className="bg-(--color-primary) hover:bg-(--color-primary)">
                  <TableHead className="text-white">Data/Hora</TableHead>
                  <TableHead className="text-white">Cerveja</TableHead>
                  <TableHead className="text-white">Tanque</TableHead>
                  <TableHead className="text-white">Temp (°C)</TableHead>
                  <TableHead className="text-white">pH</TableHead>
                  <TableHead className="text-white">Extrato (°P)</TableHead>
                  <TableHead className="text-white">Observações</TableHead>
                  <TableHead className="text-white">Classificação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{new Date(r.dataHora).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{r.cervejaNome}</TableCell>
                    <TableCell>{r.tanqueNome}</TableCell>
                    <TableCell>{r.temperatura}</TableCell>
                    <TableCell>{r.ph}</TableCell>
                    <TableCell>{r.extrato}</TableCell>
                    <TableCell>{r.observacoes ?? '—'}</TableCell>
                    <TableCell><ClassificacaoBadge classificacao={r.classificacao} /></TableCell>
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
