declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class Map {
      constructor(el: HTMLElement, opts?: MapOptions);
      addListener(event: string, handler: (e: MapMouseEvent) => void): void;
      getCenter(): LatLng;
      panTo(latLng: LatLng | LatLngLiteral): void;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setMap(map: Map | null): void;
      setPosition(latLng: LatLng | LatLngLiteral): void;
    }

    class Polyline {
      constructor(opts?: PolylineOptions);
    }

    class StreetViewPanorama {
      constructor(el: HTMLElement, opts?: StreetViewPanoramaOptions);
      addListener(event: string, handler: () => void): void;
      getPosition(): LatLng | null;
      setPano(pano: string): void;
    }

    class StreetViewService {
      getPanorama(
        request: StreetViewLocationRequest,
        callback: (
          data: StreetViewPanoramaData | null,
          status: StreetViewStatus,
        ) => void,
      ): void;
    }

    enum StreetViewSource {
      OUTDOOR = 0,
    }

    enum StreetViewStatus {
      OK = "OK",
    }

    enum SymbolPath {
      CIRCLE = 0,
      FORWARD_CLOSED_ARROW = 1,
    }

    namespace geometry {
      namespace spherical {
        function computeDistanceBetween(from: LatLng, to: LatLng): number;
      }
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      disableDefaultUI?: boolean;
      styles?: MapTypeStyle[];
      clickableIcons?: boolean;
      gestureHandling?: string;
    }

    interface MapMouseEvent {
      latLng: LatLng | null;
    }

    interface MapTypeStyle {
      elementType?: string;
      featureType?: string;
      stylers?: Array<Record<string, string | number>>;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map | null;
      icon?: MarkerIcon;
    }

    interface MarkerIcon {
      path?: SymbolPath | string;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    interface PolylineOptions {
      path?: Array<LatLng | LatLngLiteral>;
      map?: Map | null;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface StreetViewPanoramaOptions {
      pano?: string;
      addressControl?: boolean;
      linksControl?: boolean;
      panControl?: boolean;
      zoomControl?: boolean;
      fullscreenControl?: boolean;
      showRoadLabels?: boolean;
      motionTracking?: boolean;
    }

    interface StreetViewLocationRequest {
      location: LatLng | LatLngLiteral;
      radius?: number;
      source?: StreetViewSource;
    }

    interface StreetViewPanoramaData {
      location: {
        latLng: LatLng;
        pano: string;
      };
    }
  }
}

interface Window {
  google?: typeof google;
  initRvaMaps?: () => void;
}
