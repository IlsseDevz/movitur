declare module 'leaflet' {
  export type LatLngExpression = [number, number] | { lat: number; lng: number };

  export interface MapOptions {
    center?: LatLngExpression;
    zoom?: number;
  }

  export interface TileLayerOptions {
    attribution?: string;
    maxZoom?: number;
  }

  export interface IconOptions {
    iconUrl?: string;
    iconRetinaUrl?: string;
    shadowUrl?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    shadowSize?: [number, number];
    className?: string;
  }

  export interface FitBoundsOptions {
    padding?: [number, number];
  }

  export interface MarkerOptions {
    icon?: Icon;
  }

  export interface PolylineOptions {
    color?: string;
    weight?: number;
    opacity?: number;
  }

  export class Polyline {
    constructor(latlngs: LatLngExpression[], options?: PolylineOptions);
    addTo(map: Map): this;
    remove(): this;
  }

  export class LatLngBounds {
    extend(latLng: LatLngExpression): this;
    isValid(): boolean;
  }

  export class Icon {
    constructor(options?: IconOptions);
  }

  export class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setView(center: LatLngExpression, zoom?: number): this;
    fitBounds(bounds: LatLngBounds, options?: FitBoundsOptions): this;
    remove(): this;
  }

  export class Marker {
    constructor(latLng: LatLngExpression, options?: MarkerOptions);
    addTo(map: Map): this;
    bindPopup(content: string): this;
    on(event: string, handler: () => void): this;
  }

  export class TileLayer {
    constructor(url: string, options?: TileLayerOptions);
    addTo(map: Map): this;
  }

  export function polyline(latlngs: LatLngExpression[], options?: PolylineOptions): Polyline;
  export function latLngBounds(latlngs?: LatLngExpression[]): LatLngBounds;
  export function icon(options: IconOptions): Icon;
  export function map(element: HTMLElement | string, options?: MapOptions): Map;
  export function tileLayer(url: string, options?: TileLayerOptions): TileLayer;
  export function marker(latLng: LatLngExpression, options?: MarkerOptions): Marker;

  const L: {
    map: typeof map;
    tileLayer: typeof tileLayer;
    marker: typeof marker;
    icon: typeof icon;
    latLngBounds: typeof latLngBounds;
    polyline: typeof polyline;
    LatLngBounds: typeof LatLngBounds;
    Polyline: typeof Polyline;
    Icon: typeof Icon;
    Map: typeof Map;
    TileLayer: typeof TileLayer;
    Marker: typeof Marker;
  };

  export default L;
}

declare module 'leaflet/dist/leaflet.css';
