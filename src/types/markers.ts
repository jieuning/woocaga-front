interface Coordinates {
  address?: string;
  useremail?: string;
  latitude?: number;
  longitude?: number;
  x?: number;
  y?: number;
}

interface CoordinatesObj {
  positions: Coordinates[];
}

interface AddMarker {
  latitude: number;
  longitude: number;
  address: string;
}

interface KakaoCoordinates {
  lat: number;
  lng: number;
}

interface MarkerInfo {
  useremail?: string;
  name?: string | null;
  address?: string;
  category?: string;
  coordinates?: Coordinates[];
}

interface initialType {
  markerData?: MarkerInfo[];
  loading?: boolean;
  error?: string | null | undefined;
}

interface MarkerData {
  markers: initialType;
}

interface InfoData {
  address_name?: string;
  category_group_code?: string;
  category_group_name?: string;
  distance?: string;
  id?: string;
  phone?: string;
  place_name?: string;
  place_url?: string;
  road_address_name?: string;
  x?: string;
  y?: string;
}

interface UserDataType {
  token?: string | undefined;
  email?: string | undefined;
}

export type {
  MarkerData,
  MarkerInfo,
  Coordinates,
  initialType,
  KakaoCoordinates,
  AddMarker,
  CoordinatesObj,
  InfoData,
  UserDataType,
};
