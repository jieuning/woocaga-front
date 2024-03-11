import { useState } from 'react';
// image
import myCoffeeMarker from '../assets/my_coffee_marker.png';
import myDessertMarker from '../assets/my_dessert_marker.png';
import { IoCloseOutline } from 'react-icons/io5';
import { IoTrashOutline } from 'react-icons/io5';
// components
import { Modal, ModalInfo } from './Modals';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { removeMarker } from '../store/markerSlice';
// axios
import axios from 'axios';

interface MyMarkersProps {
  setOpenMyMarkers: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MyMarkers = ({ setOpenMyMarkers }: MyMarkersProps) => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((State) => State.user);
  const markerData = useAppSelector((state) => state.markers.markerData);
  const dispatch = useAppDispatch();

  console.log(markerData);

  const [myMarkerCategory, setMyMarkerCategory] = useState<string>('커피류');
  const [deleteAddress, setDeleteAddress] = useState<string | ''>('');
  const [markerDeleteModal, setMarkerDeleteModal] = useState<boolean>(false);

  console.log(deleteAddress);

  const handleClickDelete = async () => {
    try {
      if (deleteAddress) {
        const response = await axios.delete(`${URL}/marker_delete`, {
          data: { address: deleteAddress },
        });

        if (response.status === 200) {
          dispatch(removeMarker(deleteAddress));
        }
      }
    } catch (err) {
      alert('예기치 못한 에러가 발생했습니다.');
    }
  };

  const myMarkersDeleteModal: ModalInfo = {
    content: '해당 마커를 삭제하시겠습니까?',
    btntext: '삭제',
    lonclick: () => {
      setMarkerDeleteModal((close) => !close);
    },
    ronclick: () => {
      handleClickDelete();
      setMarkerDeleteModal((close) => !close);
    },
  };

  return (
    <>
      {markerDeleteModal && <Modal info={myMarkersDeleteModal} />}
      <section className="absolute top-0 left-0 w-full h-screen bg-black/[.6] z-40">
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-96 px-4 bg-white rounded-md scrollbar">
          <div className="sticky top-0 flex gap-2 justify-center pt-4 pb-6 bg-white">
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
          <ul className="flex flex-col gap-2.5">
            {myMarkerCategory === '커피류' &&
              (markerData?.filter(
                (marker) =>
                  marker.useremail === userData.email &&
                  marker.category === '커피류'
              ).length === 0 ? (
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full break-keep text-center text-brown">
                  마커 내역이 없습니다
                </p>
              ) : (
                markerData?.map(
                  (marker) =>
                    marker.useremail === userData.email &&
                    marker.category === '커피류' && (
                      <li
                        key={marker.address}
                        className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5 text-sm"
                      >
                        <img
                          className="w-6"
                          src={myCoffeeMarker}
                          alt="커피 마커"
                        />
                        <div className="flex justify-between items-center w-full">
                          <span>{marker.address}</span>
                          <button
                            onClick={() => {
                              setDeleteAddress(marker.address ?? '');
                              setMarkerDeleteModal(true);
                            }}
                          >
                            <IoTrashOutline size={18} />
                          </button>
                        </div>
                      </li>
                    )
                )
              ))}
            {myMarkerCategory === '디저트' &&
              (markerData?.filter(
                (marker) =>
                  marker.useremail === userData.email &&
                  marker.category === '디저트'
              ).length === 0 ? (
                <p className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full break-keep text-center text-brown">
                  마커 내역이 없습니다
                </p>
              ) : (
                markerData?.map(
                  (marker) =>
                    marker.useremail === userData.email &&
                    marker.category === '디저트' && (
                      <li
                        key={marker.address}
                        className="flex items-center gap-2.5 border-b border-gray-200 pb-2.5 text-sm"
                      >
                        <img
                          className="w-6"
                          src={myDessertMarker}
                          alt="커피 마커"
                        />
                        <div className="flex justify-between items-center w-full">
                          <span>{marker.address}</span>
                          <button
                            onClick={() => {
                              setDeleteAddress(marker.address ?? '');
                              setMarkerDeleteModal(true);
                            }}
                          >
                            <IoTrashOutline size={18} />
                          </button>
                        </div>
                      </li>
                    )
                )
              ))}
          </ul>
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
