'use client';

import Link from 'next/link';
import { Card } from '@/components';
import { useAuth } from '@/context/AuthContext';

const links = [
  { to: '/cliente/destinos', label: 'Explorar Destinos', desc: 'Descubra locais turisticos em Mocambique' },
  { to: '/cliente/guias', label: 'Encontrar Guias', desc: 'Guias certificados para a sua viagem' },
  { to: '/cliente/simulador', label: 'Simular Orcamento', desc: 'Planeie a viagem dentro do seu orcamento' },
  { to: '/cliente/poupancas', label: 'Minhas Poupancas', desc: 'Guarde dinheiro para a proxima viagem' },
  { to: '/cliente/favoritos', label: 'Meus Favoritos', desc: 'Destinos e guias guardados' },
  { to: '/cliente/reservas', label: 'Minhas Reservas', desc: 'Pedir e acompanhar reservas' },
  { to: '/cliente/categorias', label: 'Ver Categorias', desc: 'Tipos de experiencia turistica' },
];

export function PainelClientePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary-dark">Ola, {user?.nomeCompleto?.split(' ')[0]}!</h2>
        <p className="text-gray-500">Bem-vindo a sua area de cliente MoviTur.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link) => (
          <Link key={link.to} href={link.to}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <h4 className="font-semibold text-primary mb-1">{link.label}</h4>
              <p className="text-sm text-gray-500">{link.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
