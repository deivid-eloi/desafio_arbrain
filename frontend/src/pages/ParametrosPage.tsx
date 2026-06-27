import { useEffect, useState } from 'react';
import type { CervejaResponse, ParametrosRequest } from '../types';
import { cervejasService } from '../services/cervejasService';
import { parametrosService } from '../services/parametrosService';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Parâmetros Fermentativos</h1>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">Configure os limites aceitáveis por cerveja</p>

      {erro && <p className="mb-4 text-sm text-(--color-red)">{erro}</p>}
      {sucesso && <p className="mb-4 text-sm font-semibold text-(--color-green)">{sucesso}</p>}

      <div className="mb-6 max-w-100">
        <label className="mb-1.5 block text-sm text-muted-foreground">Selecione uma cerveja</label>
        <Select
          value={cervejaId ? String(cervejaId) : undefined}
          onValueChange={(v) => selecionarCerveja(parseInt(v))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="— Selecione —" />
          </SelectTrigger>
          <SelectContent>
            {cervejas.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nome} ({c.estilo})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {cervejaId && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{jaExiste ? 'Editar Parâmetros' : 'Definir Parâmetros'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {camposParam.map((campo) => (
                  <div key={campo.min}>
                    <p className="mb-1 text-sm text-muted-foreground">{campo.label}</p>
                    <div className="flex gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-muted-foreground">Mín</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form[campo.min] || ''}
                          onChange={(e) => setForm({ ...form, [campo.min]: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-xs text-muted-foreground">Máx</label>
                        <Input
                          type="number"
                          step="0.01"
                          value={form[campo.max] || ''}
                          onChange={(e) => setForm({ ...form, [campo.max]: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={salvar} disabled={salvando} className="mt-4">
                {salvando ? 'Salvando...' : 'Salvar Parâmetros'}
              </Button>
            </CardContent>
          </Card>

          {jaExiste && (
            <Card className="mt-4 border-l-4 border-l-(--color-green)">
              <CardHeader>
                <CardTitle className="text-sm">Parâmetros Atuais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="mb-0.5 text-xs text-muted-foreground">Temperatura</p>
                    <p className="text-sm text-foreground">{form.temperaturaMinima} – {form.temperaturaMaxima} °C</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs text-muted-foreground">pH</p>
                    <p className="text-sm text-foreground">{form.phMinimo} – {form.phMaximo}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-xs text-muted-foreground">Extrato</p>
                    <p className="text-sm text-foreground">{form.extratoPMinimo} – {form.extratoPMaximo} °P</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
