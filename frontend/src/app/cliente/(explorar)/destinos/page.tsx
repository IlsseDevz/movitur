import { Suspense } from 'react';
import { DestinosPage } from '@/views/DestinosPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-gray-500 text-center py-8">A carregar...</p>}>
      <DestinosPage />
    </Suspense>
  );
}
