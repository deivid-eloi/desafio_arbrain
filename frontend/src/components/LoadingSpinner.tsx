interface Props {
  tamanho?: number;
}

export default function LoadingSpinner({ tamanho = 32 }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        width: tamanho,
        height: tamanho,
        border: '3px solid var(--color-border)',
        borderTopColor: 'var(--color-yellow)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
    </div>
  );
}
