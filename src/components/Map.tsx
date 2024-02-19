import { useEffect, useState } from 'react';
import { MarkerInfo, initialType } from '../types/markers';
// 이미지
import coffeeMarker from '../assets/coffee_marker.png';
import dessertMarker from '../assets/dessert_marker.png';
// 컴포넌트
import { Category } from './Category';
import {
  coffeeCoordinates,
  dessertCoordinates,
} from '../utils/PositionByCategory';
import { addingMarkersToAMap } from '../utils/AddingMakersToAMap';
// 리덕스
import { useDispatch, useSelector } from 'react-redux';
import { addMarker } from '../store/markerSlice';

import axios from 'axios';

declare global {
  interface Window {
    kakao: any;
  }
}

export const Map = () => {
  const data = useSelector((state: { markers: initialType }) => state.markers);
  const dispatch = useDispatch();
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}/marker`;

  const [activeCategory, setActiveCategory] = useState<string>('커피류');

  // 로컬 스토리지에서 초기 데이터 가져오기
  const storedMarkers = localStorage.getItem('markers');
  const [localMarkers, setLocalMarkers] = useState<MarkerInfo[]>(
    storedMarkers ? JSON.parse(storedMarkers) : data.markerData
  );

  useEffect(() => {
    // 데이터가 변경될 때마다 로컬 스토리지 업데이트
    if (data.markerData) {
      localStorage.setItem('markers', JSON.stringify(data.markerData));
      setLocalMarkers(data.markerData);
    }
  }, [data.markerData]);

  useEffect(() => {
    loadKakaoMap();
  }, [activeCategory]);

  const loadKakaoMap = () => {
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

      // 카테고리별 위도, 경도 데이터
      const coffeePositions = coffeeCoordinates(localMarkers);
      const dessertPositions = dessertCoordinates(localMarkers);

      // 해당 카테고리에 마커 추가
      if (activeCategory !== '디저트') {
        addingMarkersToAMap(coffeePositions, map, markerImage);
      } else {
        addingMarkersToAMap(dessertPositions, map, markerImage);
      }

      // 클릭 이벤트 핸들러
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;

        // 위도, 경도 -> 주소로 변환
        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              // state에 추가할 obj
              const newMarker: MarkerInfo = {
                address: result[0].address.address_name,
                category: activeCategory !== '디저트' ? '커피류' : '디저트',
                coordinates: [
                  {
                    latitude: latlng.getLat(),
                    longitude: latlng.getLng(),
                  },
                ],
              };

              if (newMarker) {
                // db에 저장
                axios
                  .post(`${URL}/add`, JSON.stringify(newMarker), {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                  .then((response) => {
                    const data = response.data.newMarker;
                    // state에 마커 추가
                    dispatch(addMarker(data));
                  })
                  .catch((error) => {
                    alert('이미 추가된 마커입니다.');
                  });

                // 마커 생성
                const marker = new kakao.maps.Marker({
                  position: latlng,
                  image: markerImage,
                });

                // 렌더링
                marker.setMap(map);
                // 마커 드래그
                marker.setDraggable(true);
              }
            } else {
              alert('일치하는 주소가 존재하지 않습니다.');
            }
          }
        );
      });
    }
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
