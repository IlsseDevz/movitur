export const MAPUTO_ORIGEM = {
  nome: 'Maputo',
  latitude: -25.969,
  longitude: 32.573,
} as const;

export interface RotaResultado {
  coordenadas: [number, number][];
  distanciaKm: number;
  duracaoHoras: number;
}

interface OsrmRouteResponse {
  routes?: Array<{
    distance: number;
    duration: number;
    geometry: {
      coordinates: [number, number][];
    };
  }>;
  code?: string;
  message?: string;
}

function formatDuracao(segundos: number): number {
  return Math.round((segundos / 3600) * 10) / 10;
}

export async function buscarRotaRodoviaria(
  origem: { latitude: number; longitude: number },
  destino: { latitude: number; longitude: number },
): Promise<RotaResultado> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${origem.longitude},${origem.latitude};${destino.longitude},${destino.latitude}` +
    `?overview=full&geometries=geojson`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Nao foi possivel calcular a rota.');
  }

  const data: OsrmRouteResponse = await res.json();
  const route = data.routes?.[0];
  if (!route) {
    throw new Error(data.message || 'Rota nao encontrada para este destino.');
  }

  const coordenadas = route.geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);

  return {
    coordenadas,
    distanciaKm: Math.round(route.distance / 100) / 10,
    duracaoHoras: formatDuracao(route.duration),
  };
}
