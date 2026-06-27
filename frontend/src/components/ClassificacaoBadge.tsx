import { Badge } from '@/components/ui/badge';

// Badge colorido para a classificação de um registro fermentativo.
// Usa o componente Badge do shadcn/ui com variantes de cor próprias da
// paleta ArBrain (definidas em components/ui/badge.tsx).
type VarianteBadge = 'dentroDopadrao' | 'atencao' | 'foraDoPadrao';

const config: Record<string, { variante: VarianteBadge; label: string }> = {
  DentroDopadrao: { variante: 'dentroDopadrao', label: 'Dentro do Padrão' },
  Atencao: { variante: 'atencao', label: 'Atenção' },
  ForaDoPadrao: { variante: 'foraDoPadrao', label: 'Fora do Padrão' },
};

interface Props {
  classificacao: string;
}

export default function ClassificacaoBadge({ classificacao }: Props) {
  const item = config[classificacao];

  // Classificação desconhecida: badge neutro com o valor cru.
  if (!item) {
    return <Badge variant="secondary">{classificacao}</Badge>;
  }

  return <Badge variant={item.variante}>{item.label}</Badge>;
}
