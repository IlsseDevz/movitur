import { Suspense } from 'react';
import { RedefinirSenhaPage } from '@/views/RedefinirSenhaPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-gray-500 text-center py-8">A carregar...</p>}>
      <RedefinirSenhaPage />
    </Suspense>
  );
}
