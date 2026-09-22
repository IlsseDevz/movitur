'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card } from '@/components';
import { useAuth } from '@/context/AuthContext';

export function ClienteLandingPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'CLIENTE') {
      router.replace('/cliente/inicio');
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated && user?.role === 'CLIENTE') {
    return null;
  }

  return (
    <Card className="text-center">
      <span className="text-5xl block mb-4">&#9992;</span>
      <h1 className="text-2xl font-bold text-primary-dark mb-2">Portal do Cliente</h1>
      <p className="text-gray-600 text-sm mb-8">
        Explore destinos turisticos de Mocambique, encontre guias e simule o orcamento da sua viagem.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
        <Link href="/cliente/destinos">
          <Button variant="accent" className="w-full sm:w-auto px-8">
            Explorar Destinos
          </Button>
        </Link>
        <Link href="/cliente/registo">
          <Button variant="primary" className="w-full sm:w-auto px-8">
            Criar Conta
          </Button>
        </Link>
        <Link href="/cliente/login">
          <Button variant="secondary" className="w-full sm:w-auto px-8">
            Iniciar Sessao
          </Button>
        </Link>
      </div>

      <p className="text-xs text-gray-400">
        Pode navegar categorias, destinos e guias sem conta. Reservas e simulador exigem login.
      </p>
    </Card>
  );
}
