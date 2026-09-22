import { EstabelecimentoDetalhePage } from '@/views/EstabelecimentoDetalhePage';

export function generateStaticParams() {
  return [{ id: '_' }];
}

export default function Page() {
  return <EstabelecimentoDetalhePage />;
}
