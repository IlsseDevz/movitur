import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { favoritoService } from '@/services';
import type { TipoFavorito } from '@/types';

interface FavoritosContextValue {
  destinoIds: Set<number>;
  guiaIds: Set<number>;
  loading: boolean;
  isFavorito: (tipo: TipoFavorito, itemId: number) => boolean;
  toggle: (tipo: TipoFavorito, itemId: number) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const FavoritosContext = createContext<FavoritosContextValue | null>(null);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [destinoIds, setDestinoIds] = useState<Set<number>>(new Set());
  const [guiaIds, setGuiaIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'CLIENTE') {
      setDestinoIds(new Set());
      setGuiaIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const ids = await favoritoService.listarIds();
      setDestinoIds(new Set(ids.destinoIds));
      setGuiaIds(new Set(ids.guiaIds));
    } catch {
      setDestinoIds(new Set());
      setGuiaIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorito = useCallback(
    (tipo: TipoFavorito, itemId: number) =>
      tipo === 'DESTINO' ? destinoIds.has(itemId) : guiaIds.has(itemId),
    [destinoIds, guiaIds],
  );

  const toggle = useCallback(
    async (tipo: TipoFavorito, itemId: number) => {
      const active = isFavorito(tipo, itemId);
      if (active) {
        await favoritoService.remover(tipo, itemId);
        if (tipo === 'DESTINO') {
          setDestinoIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        } else {
          setGuiaIds((prev) => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
          });
        }
        return false;
      }
      await favoritoService.adicionar({ tipo, itemId });
      if (tipo === 'DESTINO') {
        setDestinoIds((prev) => new Set(prev).add(itemId));
      } else {
        setGuiaIds((prev) => new Set(prev).add(itemId));
      }
      return true;
    },
    [isFavorito],
  );

  const value = useMemo(
    () => ({ destinoIds, guiaIds, loading, isFavorito, toggle, refresh }),
    [destinoIds, guiaIds, loading, isFavorito, toggle, refresh],
  );

  return <FavoritosContext.Provider value={value}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  return ctx;
}
