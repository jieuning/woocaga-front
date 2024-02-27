import { Coordinates } from '../types/markers';
import { kakao } from '../App';

export const addingMarkersToAMap = (
  positions: Coordinates[],
  map: any,
  markerImage: any
) => {
  positions?.forEach((addMarker) => {
    const markerPosition = new kakao.maps.LatLng(
      addMarker.latitude,
      addMarker.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImage,
      clickable: true,
    });
    marker.setMap(map);
  });
};
