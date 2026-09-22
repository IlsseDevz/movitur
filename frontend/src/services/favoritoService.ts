import api from './api';
import type { Favorito, FavoritoIds, FavoritoRequest, TipoFavorito } from '@/types';

export const favoritoService = {
  listar: () =>
    api.get<Favorito[]>('/favoritos').then((r) => r.data),

  listarIds: () =>
    api.get<FavoritoIds>('/favoritos/ids').then((r) => r.data),

  adicionar: (data: FavoritoRequest) =>
    api.post<Favorito>('/favoritos', data).then((r) => r.data),

  remover: (tipo: TipoFavorito, itemId: number) =>
    api.delete(`/favoritos/${tipo}/${itemId}`),

  verificar: (tipo: TipoFavorito, itemId: number) =>
    api.get<{ favorito: boolean }>(`/favoritos/${tipo}/${itemId}`).then((r) => r.data.favorito),
};
