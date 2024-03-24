import React, { useCallback, useRef, useState } from 'react';
// image
import myCoffeeMarker from '../assets/my_coffee_marker.png';
import myDessertMarker from '../assets/my_dessert_marker.png';
import { IoCloseOutline } from 'react-icons/io5';
// components
import { Modal, ModalInfo } from './Modals';
import { Loading } from './Loading';
import { MarkerList } from './MarkerList';
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
  const queryClient = useQueryClient();

  const [myMarkerCategory, setMyMarkerCategory] = useState<string>('커피류');
  const [deleteAddress, setDeleteAddress] = useState<string>('');
  const [markerDeleteModal, setMarkerDeleteModal] = useState<boolean>(false);
  const pageSize = 10;
  const observer = useRef<IntersectionObserver | null>(null);

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ['myMarkers', myMarkerCategory],
    ({ pageParam = 1 }) => pageFetcher(pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.page < lastPage.totalPages) {
          return lastPage.page + 1;
        }
        return undefined;
      },
      staleTime: 3 * 60 * 1000,
    }
  );

  const lastMarkerRef = useCallback(
    (node: any) => {
      if (isFetchingNextPage || !hasNextPage || !node) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // 마커 삭제 요청
  const { mutate } = useMutation(
    (address: string) =>
      axios.delete(`${URL}/marker_delete`, {
        data: { address: address },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('markerData');
        queryClient.invalidateQueries(['myMarkers', myMarkerCategory]);
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
          <div className="my-height scrollbar">
            <ul className="flex flex-col gap-2.5 pr-2.5">
              {isLoading ? (
                <Loading />
              ) : isError ? (
                <div>에러가 발생했습니다</div>
              ) : (
                data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.markers.map((marker: MarkerInfo, index: number) => {
                      const isLastMarker =
                        index === page.markers.length - 1 &&
                        data.pages.length - 1 === i;
                      return (
                        <React.Fragment key={marker.address}>
                          {myMarkerCategory === '커피류' && (
                            <MarkerList
                              setDeleteAddress={setDeleteAddress}
                              setMarkerDeleteModal={setMarkerDeleteModal}
                              myMarkerImage={myCoffeeMarker}
                              marker={marker}
                            />
                          )}
                          {myMarkerCategory === '디저트' && (
                            <MarkerList
                              setDeleteAddress={setDeleteAddress}
                              setMarkerDeleteModal={setMarkerDeleteModal}
                              myMarkerImage={myDessertMarker}
                              marker={marker}
                            />
                          )}
                          {isLastMarker && <div ref={lastMarkerRef} />}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))
              )}
            </ul>
            {isFetchingNextPage && <Loading />}
          </div>
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
