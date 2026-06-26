// Badge colorido para a classificação de um registro fermentativo.
// Cores vêm do design system (variáveis CSS definidas em index.css).
const coresClassificacao: Record<string, { bg: string; label: string }> = {
  DentroDopadrao: { bg: 'var(--color-green)', label: 'Dentro do Padrão' },
  Atencao: { bg: 'var(--color-yellow)', label: 'Atenção' },
  ForaDoPadrao: { bg: 'var(--color-red)', label: 'Fora do Padrão' },
};

interface Props {
  classificacao: string;
}

export default function ClassificacaoBadge({ classificacao }: Props) {
  const config = coresClassificacao[classificacao] ?? {
    bg: 'var(--color-gray)',
    label: classificacao,
  };

  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.6rem',
      borderRadius: 4,
      background: config.bg,
      color: '#1a1a1a',
      fontWeight: 600,
      fontSize: '0.8rem',
    }}>
      {config.label}
    </span>
  );
}
