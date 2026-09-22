'use client';

import dynamic from 'next/dynamic';

export { destinosComCoordenadas } from './destinoMapUtils';
export type { DestinoMapMarker, MapaOrigem } from './destinoMapUtils';

export const DestinoMap = dynamic(
  () => import('./DestinoMap').then((m) => m.DestinoMap),
  {
    ssr: false,
    loading: () => (
      <div
        className="bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm"
        style={{ height: '480px' }}
      >
        A carregar mapa...
      </div>
    ),
  },
);
