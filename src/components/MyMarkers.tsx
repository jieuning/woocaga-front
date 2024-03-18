import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
// image
import myCoffeeMarker from '../assets/my_coffee_marker.png';
import myDessertMarker from '../assets/my_dessert_marker.png';
import { IoCloseOutline } from 'react-icons/io5';
import { IoTrashOutline } from 'react-icons/io5';
// components
import { Modal, ModalInfo } from './Modals';
import { Loading } from './Loading';
// redux
import { useAppSelector } from '../App';
// react query
import { useMutation, useQueryClient, useInfiniteQuery } from 'react-query';
// axios
import axios from 'axios';
import { MarkerInfo } from '../types/markers';

interface MyMarkersProps {
  setOpenMyMarkers: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MyMarkers = ({ setOpenMyMarkers }: MyMarkersProps) => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((State) => State.user);
  const markerData = useAppSelector((state) => state.markers.markerData);
  const queryClient = useQueryClient();

  const [myMarkerCategory, setMyMarkerCategory] = useState<string>('커피류');
  const [deleteAddress, setDeleteAddress] = useState<string>('');
  const [markerDeleteModal, setMarkerDeleteModal] = useState<boolean>(false);
  const pageSize = 10;

  const pageFetcher = async (page: number) => {
    const response = await axios.get(`${URL}/pagination`, {
      params: {
        page: page,
        pageSize: pageSize,
        user: userData.email,
        category: myMarkerCategory,
      },
    });
    return response.data;
  };

  // 무한 스크롤
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    error,
    refetch,
  } = useInfiniteQuery(
    'myMarkers',
    ({ pageParam = 1 }) => pageFetcher(pageParam),
    {
      getNextPageParam: (lastPage) => {
        console.log(lastPage);
        if (lastPage.lastPage) {
          return undefined;
        }
        return lastPage.page + 1;
      },
      refetchOnWindowFocus: false,
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    refetch();
  }, [myMarkerCategory]);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // 데이터 합치기
  const datas = data?.pages.flatMap((page) => page.markers);

  // 마커 삭제 요청
  const { mutate } = useMutation(
    (address: string) =>
      axios.delete(`${URL}/marker_delete`, {
        data: { address: address },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('markerData');
        alert('해당 마커가 삭제되었습니다.');
      },
      onError: () => {
        alert('예기치 못한 에러가 발생했습니다.');
      },
    }
  );

  const myMarkersDeleteModal: ModalInfo = {
    content: '해당 마커를 삭제하시겠습니까?',
    btntext: '삭제',
    lonclick: () => {
      setMarkerDeleteModal((close) => !close);
    },
    ronclick: () => {
      mutate(deleteAddress);
      setMarkerDeleteModal((close) => !close);
    },
  };

  return (
    <>
      {markerDeleteModal && <Modal info={myMarkersDeleteModal} />}
      <section className="absolute top-0 left-0 w-full h-screen bg-black/[.6] z-40">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 px-4 bg-white rounded-md">
          <div className="flex gap-2 justify-center pt-4 pb-6 bg-white">
            <button
              onClick={() => setMyMarkerCategory('커피류')}
              className={`${myMarkerCategory === '커피류' ? 'bg-primary' : 'bg-lightbrown'} hover:bg-primary text-white text-sm rounded-3xl px-2.5 py-1 transition-all`}
            >
              커피류
            </button>
            <button
              onClick={() => setMyMarkerCategory('디저트')}
              className={`${myMarkerCategory === '디저트' ? 'bg-primary' : 'bg-lightbrown'} hover:bg-primary  text-white text-sm rounded-3xl px-2.5 py-1 transition-all`}
            >
              디저트
            </button>
          </div>
          {isFetching ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Loading />
            </div>
          ) : (
            <div className="my-height scrollbar">
              <ul className="flex flex-col gap-2.5">
                {datas && datas.length !== 0 ? (
                  datas.map((marker: MarkerInfo) => (
                    <li
                      key={marker.address}
                      className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5 text-sm"
                    >
                      <img
                        className="w-6"
                        src={
                          marker.category !== '디저트'
                            ? myCoffeeMarker
                            : myDessertMarker
                        }
                        alt="커피 마커"
                      />
                      <div className="flex justify-between items-center w-full">
                        <span className="text-black">{marker.address}</span>
                        <button
                          onClick={() => {
                            marker.address && setDeleteAddress(marker.address);
                            setMarkerDeleteModal(true);
                          }}
                        >
                          <IoTrashOutline color="#162220" size={18} />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full break-keep text-center text-brown">
                    마커 내역이 없습니다
                  </p>
                )}
                <div ref={ref}></div>
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={() => setOpenMyMarkers((close) => !close)}
          className="absolute top-[76%] left-1/2 -translate-x-1/2 w-11 h-11 bg-lightbrown hover:bg-primary transition-all rounded-full flex items-center justify-center"
        >
          <IoCloseOutline size={26} color="#fff" />
        </button>
      </section>
    </>
  );
};
