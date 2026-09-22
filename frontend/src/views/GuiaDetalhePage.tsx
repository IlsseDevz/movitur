'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge, Card } from '@/components';
import { FavoritoButton } from '@/components/FavoritoButton';
import { FeedbackSection } from '@/components/FeedbackSection';
import { guiaService } from '@/services';
import type { GuiaTuristico } from '@/types';

export function GuiaDetalhePage() {
  const params = useParams();
  const id = params.id as string | undefined;
  const [guia, setGuia] = useState<GuiaTuristico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const guiaId = Number(id);
    if (!guiaId) return;
    guiaService.buscar(guiaId)
      .then(setGuia)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-500 text-center py-8">A carregar...</p>;
  if (error || !guia) return <p className="text-red-600">{error || 'Guia nao encontrado.'}</p>;

  return (
    <div className="space-y-6">
      <Link href="/cliente/guias" className="text-sm text-primary hover:underline">&larr; Voltar aos guias</Link>

      <div className="flex items-start gap-4">
        {guia.fotoUrl ? (
          <img src={guia.fotoUrl} alt={guia.nome} className="w-24 h-24 rounded-full object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl">
            {guia.nome.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-primary-dark">{guia.nome}</h1>
            <FavoritoButton tipo="GUIA" itemId={guia.id} />
          </div>
          <div className="flex items-center gap-2 mt-1 text-gray-500">
            <Badge variant="warning">{guia.avaliacaoMedia.toFixed(1)} ★</Badge>
            <span>{guia.anosExperiencia} anos de experiencia</span>
          </div>
        </div>
      </div>

      <Card title="Biografia">
        <p className="text-gray-700">{guia.biografia || 'Sem biografia disponivel.'}</p>
      </Card>

      <FeedbackSection tipoAlvo="GUIA" entidadeId={guia.id} />
    </div>
  );
}
