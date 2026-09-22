import { Suspense } from 'react';
import { RestaurantesPage } from '@/views/HoteisPage';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-gray-500 text-center py-8">A carregar...</p>}>
      <RestaurantesPage />
    </Suspense>
  );
}
