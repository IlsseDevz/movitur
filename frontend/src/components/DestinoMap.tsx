'use client';

import { useEffect, useRef } from 'react';
import L, { type LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RotaResultado } from '@/services/routeService';
import type { DestinoMapMarker, MapaOrigem } from './destinoMapUtils';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIcon2xUrl from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const MOZAMBIQUE_CENTER: LatLngExpression = [-18.665, 35.529];
const DEFAULT_ZOOM = 6;

interface DestinoMapProps {
  destinos: DestinoMapMarker[];
  height?: string;
  zoom?: number;
  center?: LatLngExpression;
  highlightId?: number;
  single?: boolean;
  origem?: MapaOrigem;
  rota?: RotaResultado | null;
  rotaDestinoId?: number | null;
  onDestinoClick?: (destinoId: number) => void;
}

function formatMoney(v?: number) {
  return v != null
    ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(v)
    : '';
}

function createMarkerIcons() {
  const markerIcon = L.icon({
    iconUrl: typeof markerIconUrl === 'string' ? markerIconUrl : markerIconUrl.src,
    iconRetinaUrl: typeof markerIcon2xUrl === 'string' ? markerIcon2xUrl : markerIcon2xUrl.src,
    shadowUrl: typeof markerShadowUrl === 'string' ? markerShadowUrl : markerShadowUrl.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const origemIcon = L.icon({
    iconUrl: typeof markerIconUrl === 'string' ? markerIconUrl : markerIconUrl.src,
    iconRetinaUrl: typeof markerIcon2xUrl === 'string' ? markerIcon2xUrl : markerIcon2xUrl.src,
    shadowUrl: typeof markerShadowUrl === 'string' ? markerShadowUrl : markerShadowUrl.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    className: 'origem-marker',
  });

  return { markerIcon, origemIcon };
}

export function DestinoMap({
  destinos,
  height = '480px',
  zoom,
  center,
  highlightId,
  single = false,
  origem,
  rota,
  rotaDestinoId,
  onDestinoClick,
}: DestinoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<ReturnType<typeof L.map> | null>(null);

  useEffect(() => {
    if (!containerRef.current || destinos.length === 0) return;

    const { markerIcon, origemIcon } = createMarkerIcons();

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    if (origem) {
      const origemLatLng: LatLngExpression = [origem.latitude, origem.longitude];
      bounds.extend(origemLatLng);
      L.marker(origemLatLng, { icon: origemIcon })
        .addTo(map)
        .bindPopup(`<strong>${origem.nome}</strong><br/><span style="color:#6b7280;font-size:13px">Ponto de partida</span>`);
    }

    destinos.forEach((d) => {
      const latLng: LatLngExpression = [d.latitude, d.longitude];
      bounds.extend(latLng);

      const preco = formatMoney(d.precoMedioEstimado);
      const linkHtml = d.link
        ? `<a href="${d.link}" style="color:#2563eb;font-weight:600">Ver detalhes</a>`
        : '';
      const rotaHtml = onDestinoClick
        ? `<br/><button type="button" data-rota-id="${d.id}" style="margin-top:6px;color:#2563eb;font-weight:600;background:none;border:none;cursor:pointer;padding:0">Ver rota desde Maputo</button>`
        : '';
      const popup = `
        <div style="min-width:160px">
          <strong>${d.nome}</strong><br/>
          <span style="color:#6b7280;font-size:13px">${d.cidade}, ${d.provincia}</span>
          ${preco ? `<br/><span style="font-size:13px">${preco} / dia</span>` : ''}
          ${linkHtml ? `<br/>${linkHtml}` : ''}
          ${rotaHtml}
        </div>
      `;

      const marker = L.marker(latLng, {
        icon: rotaDestinoId === d.id ? origemIcon : markerIcon,
      })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => onDestinoClick?.(d.id));

      marker.on('popupopen', () => {
        const btn = document.querySelector(`[data-rota-id="${d.id}"]`);
        btn?.addEventListener('click', (e) => {
          e.preventDefault();
          onDestinoClick?.(d.id);
        });
      });
    });

    if (rota?.coordenadas.length) {
      rota.coordenadas.forEach((c) => bounds.extend(c));
      L.polyline(rota.coordenadas, { color: '#2563eb', weight: 5, opacity: 0.85 }).addTo(map);
    }

    if (rota?.coordenadas.length) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (single && destinos.length === 1) {
      map.setView([destinos[0].latitude, destinos[0].longitude], zoom ?? 10);
    } else if (highlightId) {
      const highlighted = destinos.find((d) => d.id === highlightId);
      if (highlighted) {
        map.setView([highlighted.latitude, highlighted.longitude], zoom ?? 8);
      } else if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40] });
      } else {
        map.setView(center ?? MOZAMBIQUE_CENTER, zoom ?? DEFAULT_ZOOM);
      }
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    } else {
      map.setView(center ?? MOZAMBIQUE_CENTER, zoom ?? DEFAULT_ZOOM);
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [destinos, zoom, center, highlightId, single, origem, rota, rotaDestinoId, onDestinoClick]);

  if (destinos.length === 0) {
    return (
      <div
        className="bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-sm"
        style={{ height }}
      >
        Nenhum destino com coordenadas disponivel.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border border-gray-200 z-0"
      style={{ height, width: '100%' }}
    />
  );
}
