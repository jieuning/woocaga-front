import { useEffect } from 'react';

export const Map = () => {
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

        // 예시로 마커 추가
        const markerPosition = new kakao.maps.LatLng(37.54022556554232, 127.0706397574826);

        console.log(markerPosition);
        const marker = new kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ width: '80%', height: '480px' }} className='absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-1/2'></div>;
};
