import { DestinoDetalhePage } from '@/views/DestinoDetalhePage';

export function generateStaticParams() {
  return [{ id: '_' }];
}

export default function Page() {
  return <DestinoDetalhePage />;
}
