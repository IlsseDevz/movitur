import type { Destino } from '@/types';

export interface DestinoMapMarker {
  id: number;
  nome: string;
  cidade: string;
  provincia: string;
  latitude: number;
  longitude: number;
  precoMedioEstimado?: number;
  link?: string;
}

export interface MapaOrigem {
  nome: string;
  latitude: number;
  longitude: number;
}

export function destinosComCoordenadas(destinos: Destino[]): DestinoMapMarker[] {
  return destinos
    .filter((d) => d.latitude != null && d.longitude != null)
    .map((d) => ({
      id: d.id,
      nome: d.nome,
      cidade: d.cidade,
      provincia: d.provincia,
      latitude: d.latitude!,
      longitude: d.longitude!,
      precoMedioEstimado: d.precoMedioEstimado,
      link: `/cliente/destinos/${d.id}`,
    }));
}
