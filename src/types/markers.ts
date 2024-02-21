interface Coordinates {
  latitude: string;
  longitude: string;
}

interface KakaoCoordinates {
  lat: number;
  lng: number;
}

interface MarkerInfo {
  id?: number;
  name?: string | null;
  address?: string;
  category?: string;
  coordinates?: Coordinates[];
}

interface initialType {
  markerData?: MarkerInfo[];
  loading: boolean;
  error: string | null | undefined;
}

interface MarkerData {
  markers: initialType;
}

export type {
  MarkerData,
  MarkerInfo,
  Coordinates,
  initialType,
  KakaoCoordinates,
};
