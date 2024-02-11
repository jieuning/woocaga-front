import { useEffect, useState } from 'react';
import { CafeData, Coordinate } from '../types/cafes';
import coffeeIcon from '../assets/coffee_icon.png';
import desertIcon from '../assets/desert_icon.png';

interface MapProps {
  data?: CafeData;
}

export const Map = ({ data }: MapProps) => {
  // 위도, 경도 데이터
  const coffeePositions: Coordinate[] = [];
  const desertPositions: Coordinate[] = [];

  // 위도, 경도 데이터만 분리
  data?.cafes.forEach((cafe) => {
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

  const clickHandleCategory = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

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

        // 마커 추가
        if (activeCategory !== '디저트') {
          coffeePositions?.forEach((position) => {
            const markerPosition = new kakao.maps.LatLng(
              position.Ma,
              position.La
            );
            const marker = new kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          });
        } else {
          desertPositions?.forEach((position) => {
            const markerPosition = new kakao.maps.LatLng(
              position.Ma,
              position.La
            );
            const marker = new kakao.maps.Marker({
              position: markerPosition,
            });
            marker.setMap(map);
          });
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <section className="w-full px-12 absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-1/2 flex flex-col gap-3">
      <div>
        <ul className="flex gap-2.5">
          <li
            className={`rounded-2xl py-2.5 px-5 text-xs text-white flex flex-col items-center ${activeCategory === '커피류' ? 'bg-primary' : 'bg-lightbrown'} hover:bg-primary transition-all cursor-pointer`}
            onClick={() => clickHandleCategory('커피류')}
          >
            <img
              src={coffeeIcon}
              width="32"
              alt="커피 맛집"
              className="pb-1.5"
            />
            커피류
          </li>
          <li
            className={`rounded-2xl py-2.5 px-5 text-xs text-white flex flex-col items-center ${activeCategory === '디저트' ? 'bg-primary' : 'bg-lightbrown'} hover:bg-primary transition-all cursor-pointer`}
            onClick={() => clickHandleCategory('디저트')}
          >
            <img
              src={desertIcon}
              width="32"
              alt="디저트 맛집"
              className="pb-1.5"
            />
            디저트
          </li>
        </ul>
      </div>
      <div
        id="map"
        style={{ width: '100%', height: '480px', borderRadius: '10px' }}
      ></div>
    </section>
  );
};
