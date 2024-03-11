import searchMarker from '../assets/search_marker.png';
import searchIcon from '../assets/search_btn.png';
import myDessertMarker from '../assets/my_dessert_marker.png';
import myCoffeeMarker from '../assets/my_coffee_marker.png';
import { useState } from 'react';
import { kakao } from '../App';
import { InfoData, MarkerInfo, KakaoCoordinates } from '../types/markers';
import axios, { AxiosError } from 'axios';
// components
import { Modal, ModalInfo } from './Modals';
// utils
import { markerImageCustom } from '../utils/markerImageCustom';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { setInfo, deleteInfo } from '../store/searchInfoSlice';

interface KeyWordSearchProps {
  kakaoMap: any;
  activeCategory: string;
  clickedPosition: KakaoCoordinates | null;
  setClickedPosition: () => void;
  clickedAddress: string | undefined;
  mapModal: boolean;
  setMapModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: any;
}

export const KeyWordSearch = ({
  kakaoMap,
  activeCategory,
  clickedPosition,
  setClickedPosition,
  clickedAddress,
  mapModal,
  setMapModal,
  refetch,
}: KeyWordSearchProps) => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((state) => state.user);
  const searchInfoData = useAppSelector((state) => state.info.info);
  const dispatch = useAppDispatch();

  const [keyword, setKeyword] = useState<string | undefined>('');
  const [infoData, setInfoData] = useState<InfoData[] | []>([]);
  const [clickedSearchList, setClickedSearchList] = useState<boolean>(false);
  const [clickedListData, setClickedListData] = useState<InfoData[] | []>([]);
  const [markers, setMarkers] = useState<any>(null);

  // 검색 결과를 담을 객체
  let searchResults: Record<string, any> = {};

  const handleChange = (event: any) => {
    event.preventDefault();
    setKeyword(event.target.value);
  };

  const handleListClick = (info: InfoData) => {
    setClickedSearchList(true);
    setClickedListData([info]);
    setMapModal(true);
  };

  // 기존 검색 마커 클리어
  const clearMarkers = () => {
    markers.setMap(null);
    setMarkers(null);
  };

  const displayMarker = (place: InfoData) => {
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(place?.y, place?.x),
    });
    marker.setMap(kakaoMap);
    setMarkers(marker);

    // 마커 에 클릭이벤트를 등록
    kakao.maps.event.addListener(marker, 'click', function () {
      // 마커를 클릭하면 장소명이 인포윈도우에 표출
      infowindow.setContent(
        '<div style="padding:5px;font-size:12px;">' +
          place?.place_name +
          '</div>'
      );
      if (kakaoMap && marker) {
        infowindow.open(kakaoMap, marker);
      }
    });
  };

  const placesSearchCB = (data: InfoData[], status: string) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new kakao.maps.LatLngBounds();
      if (keyword) {
        // keyword를 검색 결과 키 값으로 사용
        searchResults[keyword] = data;
      }

      if (data) {
        setInfoData(data);
        dispatch(setInfo(searchResults));
      }

      console.log(data);

      for (let i = 0; i < data.length; i++) {
        displayMarker(data[i]);
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }
      kakaoMap.setBounds(bounds);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert('검색 결과가 존재하지 않습니다.');
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert('검색 결과 중 오류가 발생했습니다.');
      return;
    }
  };

  // enter키로 검색
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // 공백 제거 후 alert
      if (keyword?.trim() === '') {
        alert('키워드를 입력해주세요!');
        return false;
      }

      const searchInfoKey = Object.keys(searchInfoData);
      const searchInfoValues = Object.values(searchInfoData);
      const values: any = searchInfoValues[0];
      const bounds = new kakao.maps.LatLngBounds();

      // 검색했을 때 keyword와 local데이터의 키값이 같으면
      // kakao api를 콜하지 않고 persist데이터 사용
      if (keyword === searchInfoKey[0]) {
        for (let i = 0; i < values.length; i++) {
          displayMarker(values[i]);
          bounds.extend(new kakao.maps.LatLng(values[i].y, values[i].x));
          kakaoMap.setBounds(bounds);
        }
      } else if (keyword && keyword !== searchInfoKey[0]) {
        clearMarkers();
        // 장소 검색 객체를 생성
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(keyword, placesSearchCB);
      }
    }
  };

  const handleMarkerCreate = async () => {
    // state에 추가할 obj
    const newMarker: MarkerInfo = {
      useremail: userData.email,
      address: !clickedSearchList
        ? clickedAddress
        : clickedListData[0].address_name,
      category: activeCategory !== '디저트' ? '커피류' : '디저트',
      coordinates: !clickedSearchList
        ? [
            {
              latitude: clickedPosition?.lat,
              longitude: clickedPosition?.lng,
            },
          ]
        : [
            {
              latitude: Number(clickedListData[0].y),
              longitude: Number(clickedListData[0].x),
            },
          ],
    };

    if (kakaoMap && newMarker) {
      try {
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

        // 요청 성공시 useQuery refetch
        if (response.status === 200) {
          refetch();
        }

        if (userData.email === newMarker.useremail) {
          // 내 마커 이미지 생성
          const myMarkerImage = markerImageCustom(
            activeCategory,
            myCoffeeMarker,
            myDessertMarker
          );

          let newMarkerPositon;
          if (!clickedSearchList) {
            const mapClickedPosition = new kakao.maps.LatLng(
              clickedPosition?.lat,
              clickedPosition?.lng
            );
            newMarkerPositon = mapClickedPosition;
          } else {
            const listLat = Number(clickedListData[0].y);
            const listLng = Number(clickedListData[0].x);
            const listClickedPosition = new kakao.maps.LatLng(listLat, listLng);
            newMarkerPositon = listClickedPosition;
          }

          // 마커 생성
          const marker = new kakao.maps.Marker({
            position: newMarkerPositon,
            image: myMarkerImage,
            clickable: true,
          });

          // 렌더링
          marker.setMap(kakaoMap);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const axiosError: AxiosError = error;
          if (axiosError.response && axiosError.response.status === 400) {
            return alert('중복된 주소의 마커입니다.');
          } else if (
            axiosError.response &&
            axiosError.response.status === 403
          ) {
            return alert('근처 마커와의 거리가 80m이상이여야 합니다.');
          }
        } else {
          return alert('예기치 못한 에러가 발생했습니다.');
        }
      }
    }
  };

  const markerModalInfo: ModalInfo = {
    content: `생성하려는 마커의 주소가\n"${clickedAddress}" 맞습니까?`,
    btntext: '생성',
    lonclick: () => {
      setClickedPosition;
      setMapModal((close) => !close);
    },
    ronclick: () => {
      handleMarkerCreate();
      setMapModal((close) => !close);
    },
  };

  const listMarkerModalInfo: ModalInfo = {
    content: `생성하려는 마커의 주소가\n"${clickedListData[0]?.address_name}" 맞습니까?`,
    btntext: '생성',
    lonclick: () => {
      setClickedPosition;
      setMapModal((close) => !close);
      setClickedSearchList((set) => !set);
    },
    ronclick: () => {
      handleMarkerCreate();
      setMapModal((close) => !close);
      setClickedSearchList((set) => !set);
    },
  };

  return (
    <>
      {mapModal ? (
        <Modal
          info={!clickedSearchList ? markerModalInfo : listMarkerModalInfo}
        />
      ) : null}
      <section className="absolute right-0 w-1/4 pt-2 pr-2 flex flex-col gap-2.5 z-10 justify-end">
        <label className="w-full flex gap-1 bg-white/[.9] rounded-md py-2.5 pl-2.5 border-solid border border-primary">
          <img className="w-4 h-4" src={searchIcon} alt="검색 아이콘" />
          <input
            type="text"
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="키워드로 카페 검색"
            className="w-4/5 h-4 outline-none pl-1.5 tracking-tighter text-sm bg-transparent"
          />
        </label>
        <div className='className="w-full h-96 bg-white/[.7] rounded-md scrollbar'>
          <ul className="relative h-full flex flex-col gap-2 p-2.5 z-30">
            {infoData !== undefined && infoData.length > 0 ? (
              infoData.map((info: InfoData, index) => (
                <li
                  key={index}
                  onClick={() => handleListClick(info)}
                  className="flex items-center gap-2 text-sm pb-2.5 border-b border-gray-200 rounded-md cursor-pointer hover:bg-primary transition-all"
                >
                  <img
                    className="w-5 h-7"
                    src={searchMarker}
                    alt="내 마커 아이콘"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold">{info.place_name}</p>
                    <p className="text-xs">{info.address_name}</p>
                  </div>
                </li>
              ))
            ) : (
              <p className="absolute top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4 pl-2.5 text-brown text-center break-keep">
                검색 내용이 없습니다
              </p>
            )}
          </ul>
        </div>
      </section>
    </>
  );
};
