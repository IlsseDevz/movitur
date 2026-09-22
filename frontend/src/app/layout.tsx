import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import '@/index.css';

export const metadata: Metadata = {
  title: 'MoviTur - Ecossistema Digital de Turismo',
  description: 'Ecossistema Digital de Turismo de Mocambique',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
