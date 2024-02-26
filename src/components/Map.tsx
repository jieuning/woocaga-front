import { useEffect, useState, useRef } from 'react';
import { MarkerInfo, KakaoCoordinates } from '../types/markers';
import { kakao } from '../App';
import axios from 'axios';
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
import { Modal, ModalInfo } from './Modals';
// 리덕스
import { useAppDispatch, useAppSelector } from '../App';
import { addMarker } from '../store/markerSlice';

export const Map = () => {
  const data = useAppSelector((state) => state.markers);
  const dispatch = useAppDispatch();
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;

  const [activeCategory, setActiveCategory] = useState<string>('커피류');
  const [clickedPosition, setClickedPosition] =
    useState<KakaoCoordinates | null>(null);
  const [kakaoMap, setKakapMap] = useState<any>(null);
  const [mapModal, setMapModal] = useState<boolean>();
  const imageRef = useRef<any>(null);

  useEffect(() => {
    loadKakaoMap();
  }, [activeCategory]);

  const loadKakaoMap = () => {
    if (kakao) {
      const container = document.getElementById('map');
      const options = {
        // 건대입구역 기준
        center: new kakao.maps.LatLng(37.54022556554232, 127.0706397574826),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);
      // Map 객체에 대한 참조 저장
      setKakapMap(map);

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

      imageRef.current = markerImage;

      // 카테고리별 위도, 경도 데이터
      const coffeePositions = coffeeCoordinates(data);
      const dessertPositions = dessertCoordinates(data);

      // 해당 카테고리에 마커 추가
      if (activeCategory !== '디저트') {
        addingMarkersToAMap(coffeePositions, map, markerImage);
      } else {
        addingMarkersToAMap(dessertPositions, map, markerImage);
      }

      // 클릭 이벤트 핸들러
      kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
        const latlng = mouseEvent.latLng;
        setClickedPosition({ lat: latlng.getLat(), lng: latlng.getLng() });

        // 모달 오픈
        setMapModal(true);
      });
    }
  };

  const handleMarkerCreate = async () => {
    if (clickedPosition) {
      let geocoder = new kakao.maps.services.Geocoder();

      // 위도, 경도 -> 주소로 변환
      geocoder.coord2Address(
        clickedPosition.lng,
        clickedPosition.lat,
        async (result: any, status: any) => {
          if (status === kakao.maps.services.Status.OK) {
            // state에 추가할 obj
            const newMarker: MarkerInfo = {
              address: result[0].address.address_name,
              category: activeCategory !== '디저트' ? '커피류' : '디저트',
              coordinates: [
                {
                  latitude: clickedPosition.lat,
                  longitude: clickedPosition.lng,
                },
              ],
            };

            if (kakaoMap) {
              try {
                // mutation 사용
                // db에 저장
                const response = await axios.post(
                  `${URL}/add`,
                  JSON.stringify(newMarker),
                  {
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );
                const data = response.data.newMarker;

                // state에 마커 추가
                dispatch(addMarker(data));

                // 마커 생성
                const markerPosition = new kakao.maps.LatLng(
                  clickedPosition.lat,
                  clickedPosition.lng
                );
                const marker = new kakao.maps.Marker({
                  position: markerPosition,
                  image: imageRef.current,
                });

                // 렌더링
                marker.setMap(kakaoMap);
              } catch (error) {
                alert('이미 마커가 생성된 구역입니다.');
              }
            }
          } else {
            alert('일치하는 주소가 존재하지 않습니다.');
          }
        }
      );
    }
  };

  const markerModalInfo: ModalInfo = {
    content: '해당 위치에 마커를 추가하시겠습니까?',
    btntext: '생성',
    lonclick: () => {
      setClickedPosition(null);
      setMapModal((close) => !close);
    },
    ronclick: () => {
      handleMarkerCreate();
      setMapModal((close) => !close);
    },
  };

  return (
    <>
      {mapModal ? <Modal info={markerModalInfo} /> : null}
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
    </>
  );
};
