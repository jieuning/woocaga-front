import searchMarker from '../assets/search_marker.png';
import searchIcon from '../assets/search_btn.png';
import myDessertMarker from '../assets/my_dessert_marker.png';
import myCoffeeMarker from '../assets/my_coffee_marker.png';
import { IoCloseOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { kakao } from '../App';
import { InfoData, MarkerInfo, KakaoCoordinates } from '../types/markers';
import axios, { AxiosError } from 'axios';
// components
import { Modal, ModalInfo } from './Modals';
// utils
import { markerImageCustom } from '../utils/markerImageCustom';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { setInfo } from '../store/searchInfoSlice';
import { useMutation, useQueryClient } from 'react-query';

interface KeyWordSearchProps {
  kakaoMap: any;
  activeCategory: string;
  clickedPosition: KakaoCoordinates | null;
  setClickedPosition: () => void;
  clickedAddress: string | undefined;
  mapModal: boolean;
  setMapModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const KeyWordSearch = ({
  kakaoMap,
  activeCategory,
  clickedPosition,
  setClickedPosition,
  clickedAddress,
  mapModal,
  setMapModal,
}: KeyWordSearchProps) => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((state) => state.user);
  const searchInfoData = useAppSelector((state) => state.info.info);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const [keyword, setKeyword] = useState<string | undefined>('');
  const [previousKeyword, setPreviousKeyword] = useState<string | undefined>(
    ''
  );
  const [infoData, setInfoData] = useState<InfoData[] | []>([]);
  const [clickedSearchList, setClickedSearchList] = useState<boolean>(false);
  const [mobSearchListActive, setMobSearchListActive] =
    useState<boolean>(false);
  const [clickedListData, setClickedListData] = useState<InfoData[] | []>([]);
  const markersRef = useRef<any[]>([]);

  const handleChange = (event: any) => {
    setKeyword(event.target.value);
  };

  const handleListClick = (info: InfoData) => {
    setClickedSearchList(true);
    setClickedListData([info]);
    setMapModal(true);
  };

  const displayMarker = (place: InfoData) => {
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
    const marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(place?.y, place?.x),
    });
    marker.setMap(kakaoMap);
    markersRef.current.push(marker);

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

  // 이전 검색 내역 지도에서 제거
  const removeMarkers = () => {
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
  };

  const placesSearchCB = (data: InfoData[], status: string) => {
    if (status === kakao.maps.services.Status.OK) {
      const bounds = new kakao.maps.LatLngBounds();

      if (data) {
        setInfoData(data);
        dispatch(setInfo(data));
      }

      removeMarkers();

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

      // 이전과 같은 키워드로 검색시 redux state사용
      // 이전과 다른 키워드로 검색시 kakao api call
      if (keyword !== previousKeyword) {
        setPreviousKeyword(keyword);
        // 장소 검색 객체를 생성
        const ps = new kakao.maps.services.Places();
        ps.keywordSearch(keyword, placesSearchCB);
        setMobSearchListActive(true);
      } else {
        const bounds = new kakao.maps.LatLngBounds();
        for (let i = 0; i < searchInfoData.length; i++) {
          setInfoData(searchInfoData);
          displayMarker(searchInfoData[i]);
          bounds.extend(
            new kakao.maps.LatLng(searchInfoData[i].y, searchInfoData[i].x)
          );
        }
        kakaoMap.setBounds(bounds);
        setMobSearchListActive(true);
      }
    }
  };

  // 마커 추가
  const { mutate } = useMutation(
    (marker: MarkerInfo) =>
      axios.post(`${URL}/add`, JSON.stringify(marker), {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('markerData');
        alert('마커가 추가되었습니다.');

        if (kakaoMap && data) {
          if (userData.email === data.data.useremail) {
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
              const listClickedPosition = new kakao.maps.LatLng(
                listLat,
                listLng
              );
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
        }
      },
      onError: (error) => {
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
      },
    }
  );

  const handleMarkerCreate = () => {
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

    mutate(newMarker);
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
      <div className="w-[394px] max-lg:w-[250px] max-md:w-full px-2.5 absolute top-2.5 right-[20px] max-md:left-1/2 max-md:-translate-x-1/2 z-10 max-md:top-[52px]">
        <label className="flex flex-row gap-1 w-[394px] max-lg:w-[250px] max-md:w-full bg-white/[.9] max-md:bg-white/[.8] rounded-md py-2.5 px-2.5 border-solid border box-border border-primary">
          <img className="w-4 h-4" src={searchIcon} alt="검색 아이콘" />
          <input
            type="text"
            value={keyword}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="주소, 키워드로 카페 검색"
            className="w-4/5 h-4 outline-none pl-1.5 tracking-tighter text-sm bg-transparent"
          />
        </label>
      </div>
      <button
        onClick={() => setMobSearchListActive((close) => !close)}
        className={`${!mobSearchListActive ? 'max-md:hidden' : 'max-md:block max-md:transition-all'} hidden max-md:w-11 max-md:h-11 max-md:absolute max-md:top-[60%] max-md:left-1/2 max-md:-translate-x-1/2 max-md:rounded-3xl max-md:bg-primary max-md:flex max-md:items-center max-md:justify-center max-md:z-10`}
      >
        <IoCloseOutline size={26} color="#fff" />
      </button>
      <div
        className={`${!mobSearchListActive ? 'max-md:h-0' : 'max-md:h-60 max-md:transition-all'} h-96 search-list-position z-10 bg-white/[.7] rounded-md scrollbar max-md:w-full`}
      >
        <ul className="w-96 max-lg:w-60 h-full flex flex-col gap-2 p-2.5 z-30 max-md:w-full">
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
    </>
  );
};
