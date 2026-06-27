import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DashboardResponse, RegistroResponse } from '../types';
import { dashboardService } from '../services/dashboardService';
import { registrosService } from '../services/registrosService';
import ClassificacaoBadge from '../components/ClassificacaoBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function DashboardPage() {
  const [dados, setDados] = useState<DashboardResponse | null>(null);
  const [ultimos, setUltimos] = useState<RegistroResponse[]>([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    dashboardService.obterIndicadores()
      .then(setDados)
      .catch(() => setErro('Erro ao carregar indicadores.'));
    registrosService.listarTodos()
      .then((lista) => setUltimos(lista.slice(0, 5)))
      .catch(() => {});
  }, []);

  if (erro) return <p className="text-(--color-red)">{erro}</p>;
  if (!dados) return <LoadingSpinner />;

  // Cor de destaque por indicador (paleta ArBrain). Total usa o azul-cinza
  // (#acbbcd) em valor literal pois seu nome de token colide no Tailwind v4.
  const cards = [
    { label: 'Total de Registros', valor: dados.totalRegistros, cor: '#acbbcd' },
    { label: 'Dentro do Padrão', valor: dados.dentroDopadrao, cor: 'var(--color-green)' },
    { label: 'Atenção', valor: dados.atencao, cor: 'var(--color-yellow)' },
    { label: 'Fora do Padrão', valor: dados.foraDoPadrao, cor: 'var(--color-red)' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Bem-vindo ao BrewControl</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        Acompanhamento de fermentação em tempo real
      </p>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label} style={{ borderTop: `4px solid ${card.cor}` }}>
            <CardContent>
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-4xl font-bold" style={{ color: card.cor }}>{card.valor}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mb-8 flex gap-3">
        <Button asChild>
          <Link to="/registros">+ Novo Registro</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/cervejas">Gerenciar Cervejas</Link>
        </Button>
      </div>

      <h3 className="mb-3 text-base font-semibold text-foreground">Últimos Registros</h3>

      {ultimos.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum registro ainda. Acesse{' '}
          <Link to="/registros" className="text-(--color-yellow)">Registros</Link>{' '}
          para criar o primeiro.
        </p>
      ) : (
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
              {ultimos.map((r) => (
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
