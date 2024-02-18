interface Coordinates {
  latitude: string;
  longitude: string;
}

interface MarkerInfo {
  id?: number;
  name?: string;
  address?: string;
  category?: string;
  coordinates?: Coordinates[];
}

interface initialType {
  markerData?: MarkerInfo[];
  status: string;
}

interface MarkerData {
  markers: initialType;
}

export type { MarkerData, MarkerInfo, Coordinates, initialType };
