export function detectIntent(text: string): 'produto' | 'pedido' | 'outro' {
  const lower = text.toLowerCase();

  if (
    lower.includes('produto') ||
    lower.includes('tamanho') ||
    lower.includes('cor')
  ) {
    return 'produto';
  }

  if (
    lower.includes('pedido') ||
    lower.includes('entrega') ||
    lower.includes('rastreamento')
  ) {
    return 'pedido';
  }

  return 'outro';
}
