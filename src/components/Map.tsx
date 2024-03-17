import { useEffect, useState } from 'react';
import { KakaoCoordinates, MarkerInfo } from '../types/markers';
import { kakao } from '../App';
import axios from 'axios';
// image
import coffeeMarker from '../assets/coffee_marker.png';
import dessertMarker from '../assets/dessert_marker.png';
import myCoffeeMarker from '../assets/my_coffee_marker.png';
import myDessertMarker from '../assets/my_dessert_marker.png';
// components
import { Category } from './Category';
import { KeyWordSearch } from './KeywordSearch';
// utils
import {
  coffeeCoordinates,
  dessertCoordinates,
} from '../utils/PositionByCategory';
import { addingMarkersToAMap } from '../utils/AddingMakersToAMap';
import { markerImageCustom } from '../utils/markerImageCustom';
// redux
import { useAppSelector, useAppDispatch } from '../App';
import { setMarkers } from '../store/markerSlice';
// react query
import { useQuery } from 'react-query';

export const Map = () => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { data } = useQuery<MarkerInfo[]>(
    'markerData',
    async () => {
      const response = await axios.get(`${URL}/all`);

      if (response.status === 404) {
        throw new Error('에러가 발생했습니다.');
      }
      return response.data;
    },
    {
      staleTime: 60 * 1000,
    }
  );

  useEffect(() => {
    // 데이터가 변경될 때마다 setMarkers도 변경
    dispatch(setMarkers(data));
  }, [data]);

  const [activeCategory, setActiveCategory] = useState<string>('커피류');
  const [clickedPosition, setClickedPosition] =
    useState<KakaoCoordinates | null>(null);
  const [clickedAddress, setClickedAddress] = useState<string | undefined>('');
  const [kakaoMap, setKakaoMap] = useState<any>(null);
  const [mapModal, setMapModal] = useState<boolean>(false);

  useEffect(() => {
    loadKakaoMap();
  }, [activeCategory, data]);

  const loadKakaoMap = () => {
    if (kakao && data) {
      const container = document.getElementById('map');
      const options = {
        // 건대 입구역 기준
        center: new kakao.maps.LatLng(37.54022556554232, 127.0706397574826),
        level: 2,
      };
      const map = new kakao.maps.Map(container, options);
      // Map 객체에 대한 참조 저장
      setKakaoMap(map);

      // 마커 이미지 생성
      const markerImage = markerImageCustom(
        activeCategory,
        coffeeMarker,
        dessertMarker
      );

      // 내 마커 이미지 생성
      const myMarkerImage = markerImageCustom(
        activeCategory,
        myCoffeeMarker,
        myDessertMarker
      );

      // 카테고리별 데이터
      const coffeePositions = coffeeCoordinates(data);
      const dessertPositions = dessertCoordinates(data);

      // 해당 카테고리에 마커 생성
      if (activeCategory !== '디저트') {
        addingMarkersToAMap(
          coffeePositions,
          map,
          markerImage,
          myMarkerImage,
          userData
        );
      } else {
        addingMarkersToAMap(
          dessertPositions,
          map,
          markerImage,
          myMarkerImage,
          userData
        );
      }

      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        const lat = latlng.getLat();
        const lng = latlng.getLng();

        // 클릭한 좌표 저장
        setClickedPosition({ lat, lng });

        // 좌표 주소로 변환
        let geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          async (result: any, status: any) => {
            if (status === kakao.maps.services.Status.OK) {
              // 변환된 주소 저장
              setClickedAddress(result[0].address.address_name);
            }
          }
        );
        // 마커 생성 모달 활성화
        setMapModal(true);
      });
    }
  };

  return (
    <>
      <section className="w-full h-full px-12 flex flex-col gap-2.5 mb-4 max-lg:px-4 max-md:px-0 max-md:mb-0">
        <Category
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <div className="relative w-full h-full max-md:block">
          <KeyWordSearch
            kakaoMap={kakaoMap}
            activeCategory={activeCategory}
            clickedPosition={clickedPosition}
            clickedAddress={clickedAddress}
            mapModal={mapModal}
            setMapModal={setMapModal}
            setClickedPosition={() => setClickedPosition(null)}
          />
          <div id="map"></div>
        </div>
      </section>
    </>
  );
};
