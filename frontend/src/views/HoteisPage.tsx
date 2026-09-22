'use client';

import { EstabelecimentosListaPage } from './EstabelecimentosListaPage';

export function HoteisPage() {
  return (
    <EstabelecimentosListaPage
      tipo="HOTEL"
      titulo="Hoteis"
      subtitulo="Alojamentos em destaque — parceiros patrocinados aparecem primeiro"
    />
  );
}

export function RestaurantesPage() {
  return (
    <EstabelecimentosListaPage
      tipo="RESTAURANTE"
      titulo="Restaurantes"
      subtitulo="Onde comer em Mocambique — estabelecimentos patrocinados em evidencia"
    />
  );
}
