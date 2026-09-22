'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useFavoritos } from '@/context/FavoritosContext';
import { useToast } from '@/context/ToastContext';
import { setNavState } from '@/lib/nav-state';
import type { TipoFavorito } from '@/types';

interface FavoritoButtonProps {
  tipo: TipoFavorito;
  itemId: number;
  className?: string;
  size?: 'sm' | 'md';
}

export function FavoritoButton({ tipo, itemId, className = '', size = 'md' }: FavoritoButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const { isFavorito, toggle } = useFavoritos();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);

  const active = isAuthenticated && user?.role === 'CLIENTE' && isFavorito(tipo, itemId);
  const iconSize = size === 'sm' ? 'text-lg' : 'text-2xl';

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || user?.role !== 'CLIENTE') {
      setNavState({ from: pathname });
      router.push('/cliente/login');
      return;
    }

    setBusy(true);
    try {
      const added = await toggle(tipo, itemId);
      showToast(added ? 'Adicionado aos favoritos' : 'Removido dos favoritos', added ? 'success' : 'info');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro ao atualizar favorito', 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`${iconSize} leading-none transition-transform hover:scale-110 disabled:opacity-50 ${className}`}
    >
      {active ? '❤️' : '🤍'}
    </button>
  );
}
