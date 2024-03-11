import { useEffect, useState } from 'react';
import { KakaoCoordinates } from '../types/markers';
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
  const markerData = useAppSelector((state) => state.markers);
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { data, refetch, isFetching } = useQuery(
    'markerData',
    async () => {
      const response = await axios.get(`${URL}/all`);

      if (response.status === 404) {
        throw new Error('에러가 발생했습니다.');
      }
      return response.data;
    },
    {
      enabled: true,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    // setMarkers에 useQuery로 불러온 마커 데이터 저장
    dispatch(setMarkers(data));
  }, [data]);

  const [activeCategory, setActiveCategory] = useState<string>('커피류');
  const [clickedPosition, setClickedPosition] =
    useState<KakaoCoordinates | null>(null);
  const [clickedAddress, setClickedAddress] = useState<string | undefined>('');
  const [kakaoMap, setKakapMap] = useState<any>(null);
  const [mapModal, setMapModal] = useState<boolean>(false);

  useEffect(() => {
    loadKakaoMap();
  }, [activeCategory]);

  const loadKakaoMap = () => {
    if (kakao) {
      const container = document.getElementById('map');
      const options = {
        // 건대 입구역 기준
        center: new kakao.maps.LatLng(37.54022556554232, 127.0706397574826),
        level: 2,
      };
      const map = new kakao.maps.Map(container, options);
      // Map 객체에 대한 참조 저장
      setKakapMap(map);

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
      const coffeePositions = coffeeCoordinates(markerData);
      const dessertPositions = dessertCoordinates(markerData);

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
      <section className="w-full px-12 absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-1/2 flex flex-col gap-2.5 z-10">
        <Category
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
        <div className="flex gap-2.5">
          <div
            id="map"
            className="relative"
            style={{ width: '100%', height: '520px', borderRadius: '10px' }}
          >
            <KeyWordSearch
              kakaoMap={kakaoMap}
              activeCategory={activeCategory}
              clickedPosition={clickedPosition}
              clickedAddress={clickedAddress}
              mapModal={mapModal}
              setMapModal={setMapModal}
              refetch={refetch}
              setClickedPosition={() => setClickedPosition(null)}
            />
          </div>
        </div>
      </section>
    </>
  );
};
