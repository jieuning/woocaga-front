import { useEffect, useState } from 'react';
import { Coordinate, CafeInfo } from '../types/cafes';
// 이미지
import coffeeMarker from '../assets/coffee_marker.png';
import desertMarker from '../assets/desert_marker.png';
// 컴포넌트
import { Category } from './Category';
// 리덕스
import { useSelector, useDispatch } from 'react-redux';
import { addMarker } from '../store/cafeSlice';

export const Map = () => {
  const data = useSelector((state: { cafes: CafeInfo[] }) => state);
  const dispatch = useDispatch();

  console.log(data);

  // 위도, 경도 데이터
  const coffeePositions: Coordinate[] = [];
  const desertPositions: Coordinate[] = [];

  // 위도, 경도 데이터만 분리
  // 커피, 디저트 따로
  data?.cafes?.forEach((cafe) => {
    if (cafe.category === '커피') {
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

  const [activeCategory, setActiveCategory] = useState<string>('커피류');

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;

    document.head.appendChild(script);

    script.onload = () => {
      const kakao: any = window['kakao'];

      kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          // 건대입구역 기준
          center: new kakao.maps.LatLng(37.54022556554232, 127.0706397574826),
          level: 3,
        };

        const map = new kakao.maps.Map(container, options);

        // 마커 이미지 커스텀
        const imageSrc =
          activeCategory !== '디저트' ? coffeeMarker : desertMarker;
        const imageSize = new kakao.maps.Size(32);
        const imageOption = { offset: new kakao.maps.Point(27, 69) };
        const markerImage = new kakao.maps.MarkerImage(
          imageSrc,
          imageSize,
          imageOption
        );

        // 해당 카테고리에 마커 추가
        if (activeCategory !== '디저트') {
          coffeePositions?.forEach((position) => {
            const markerPosition = new kakao.maps.LatLng(
              position.Ma,
              position.La
            );
            const marker = new kakao.maps.Marker({
              position: markerPosition,
              image: markerImage,
            });
            marker.setMap(map);

            // 마커 클릭시 삭제 이벤트
            kakao.maps.event.addListener(marker, 'click', () => {
              deleteMarker(marker);
            });
          });
        } else {
          desertPositions?.forEach((position) => {
            const markerPosition = new kakao.maps.LatLng(
              position.Ma,
              position.La
            );
            const marker = new kakao.maps.Marker({
              position: markerPosition,
              image: markerImage,
            });
            marker.setMap(map);

            // 마커 클릭시 삭제 이벤트
            kakao.maps.event.addListener(marker, 'click', () => {
              deleteMarker(marker);
            });
          });
        }

        // 클릭 이벤트 핸들러 추가
        kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
          const latlng = mouseEvent.latLng;

          // state에 추가할 obj
          const position = {
            category: activeCategory !== '디저트' ? '커피' : '디저트',
            qa: [
              {
                Ma: latlng.getLat(),
                La: latlng.getLng(),
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

          // 마커 클릭시 삭제 이벤트
          kakao.maps.event.addListener(marker, 'click', () => {
            deleteMarker(marker);
          });
        });

        // 마커 삭제 함수
        const deleteMarker = (markerToDelete: kakao.maps.Marker) => {
          markerToDelete.setMap(null);
        };
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, [activeCategory]);

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
