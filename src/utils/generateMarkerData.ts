import { MarkerInfo } from '../types/markers';
import { UserDataType, KakaoCoordinates, InfoData } from '../types/markers';

interface generateMarkerDataProps {
  userData?: UserDataType;
  clickedAddress?: string | undefined;
  clickedPosition: KakaoCoordinates;
  activeCategory?: string;
  clickedSearchList?: boolean;
  clickedListData: InfoData[];
}

export const generateMarkerData = ({
  userData,
  clickedAddress,
  clickedPosition,
  activeCategory,
  clickedSearchList,
}: generateMarkerDataProps) => {
  const mapClicedData: MarkerInfo = {
    useremail: userData?.email,
    address: clickedAddress,
    category: activeCategory !== '디저트' ? '커피류' : '디저트',
    coordinates: [
      {
        latitude: clickedPosition.lat,
        longitude: clickedPosition.lng,
      },
    ],
  };

  return mapClicedData;
};
