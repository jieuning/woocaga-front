import { Coordinates, UserDataType } from '../types/markers';
import { kakao } from '../App';

export const addingMarkersToAMap = (
  positions: Coordinates[],
  map: any,
  markerImage: any,
  myMarkerImage: any,
  userData: UserDataType
) => {
  const addMarkerToMap = (markerData: Coordinates, markerImg: any) => {
    const markerPosition = new kakao.maps.LatLng(
      markerData.latitude,
      markerData.longitude
    );
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      image: markerImg,
      clickable: true,
    });

    // 지도에 마커 표시
    marker.setMap(map);
  };

  positions.forEach((position) => {
    if (position.useremail !== userData.email) {
      addMarkerToMap(position, markerImage);
    } else {
      addMarkerToMap(position, myMarkerImage);
    }
  });
};
