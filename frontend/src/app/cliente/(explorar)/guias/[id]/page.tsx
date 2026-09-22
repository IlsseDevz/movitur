import { GuiaDetalhePage } from '@/views/GuiaDetalhePage';

export function generateStaticParams() {
  return [{ id: '_' }];
}

export default function Page() {
  return <GuiaDetalhePage />;
}
