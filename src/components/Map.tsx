import { useEffect, useState } from 'react';
import { Coordinate, CafeInfo } from '../types/cafes';
// 이미지
import coffeeMarker from '../assets/coffee_marker.png';
import dessertMarker from '../assets/dessert_marker.png';
// 컴포넌트
import { Category } from './Category';
// 리덕스
import { useSelector, useDispatch } from 'react-redux';
import { addMarker } from '../store/cafeSlice';

declare global {
  interface Window {
    kakao: any;
  }
}

export const Map = () => {
  const data = useSelector((state: { cafes: CafeInfo[] }) => state);
  const dispatch = useDispatch();

  const [activeCategory, setActiveCategory] = useState<string>('커피류');

  useEffect(() => {
    loadKakaoMap();
  }, [activeCategory]);

  const loadKakaoMap = async () => {
    const kakao: any = window['kakao'];
    if (kakao) {
      const container = document.getElementById('map');
      const options = {
        // 건대입구역 기준
        center: new kakao.maps.LatLng(37.54022556554232, 127.0706397574826),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);
      let geocoder = new kakao.maps.services.Geocoder();

      // 마커 이미지 커스텀
      const imageSrc =
        activeCategory !== '디저트' ? coffeeMarker : dessertMarker;
      const imageSize = new kakao.maps.Size(32, 42);
      const imageOption = { offset: new kakao.maps.Point(15, 42) };
      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      // 해당 카테고리에 마커 추가
      if (activeCategory !== '디저트') {
        addMarkers(coffeePositions, map, markerImage);
      } else {
        addMarkers(desertPositions, map, markerImage);
      }

      // 클릭 이벤트 핸들러
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        // 위도, 경도로 주소 변환
        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              // state에 추가할 obj
              const position = {
                address: result[0].road_address.address_name,
                category: activeCategory !== '디저트' ? '커피류' : '디저트',
                coordinates: [
                  {
                    latitude: latlng.getLat(),
                    longitude: latlng.getLng(),
                  },
                ],
              };

              // state에 새로 생성된 마커 데이터 추가
              dispatch(addMarker(position));

              const marker = new kakao.maps.Marker({
                position: latlng,
                image: markerImage,
              });
              marker.setMap(map);
              // 마커 드래그
              marker.setDraggable(true);
            } else {
              alert('일치하는 주소가 존재하지 않습니다.');
            }
          }
        );
      });
    }
  };

  // 위도, 경도 데이터
  const coffeePositions: Coordinate[] = [];
  const desertPositions: Coordinate[] = [];

  // 위도, 경도 데이터만 분리
  // 커피, 디저트 따로
  data?.cafes?.forEach((cafe) => {
    if (cafe.category === '커피류') {
      cafe.qa?.forEach((coordinate) => {
        coffeePositions.push({
          Ma: coordinate.Ma,
          La: coordinate.La,
        });
      });
    } else if (cafe.category === '디저트') {
      cafe.qa?.forEach((coordinate) => {
        desertPositions.push({
          Ma: coordinate.Ma,
          La: coordinate.La,
        });
      });
    }
  });

  // 마커를 추가하는 함수
  const addMarkers = (positions: Coordinate[], map: any, markerImage: any) => {
    positions.forEach((position) => {
      const markerPosition = new kakao.maps.LatLng(position.Ma, position.La);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });
      marker.setMap(map);
      // 마커가 드래그 가능하도록 설정
      marker.setDraggable(true);
    });
  };

  return (
    <section className="w-full px-12 absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-1/2 flex flex-col gap-3">
      <Category
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <div
        id="map"
        style={{ width: '100%', height: '480px', borderRadius: '10px' }}
      ></div>
    </section>
  );
};
