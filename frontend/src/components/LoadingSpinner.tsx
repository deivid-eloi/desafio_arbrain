import { Loader2 } from 'lucide-react';

interface Props {
  tamanho?: number;
}

// Indicador de carregamento — ícone do lucide com animação utilitária do Tailwind.
export default function LoadingSpinner({ tamanho = 32 }: Props) {
  return (
    <div className="flex justify-center p-8">
      <Loader2 size={tamanho} className="animate-spin text-(--color-yellow)" />
    </div>
  );
}
