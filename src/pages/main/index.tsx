import { Map } from '../../components/Map';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarkerData } from '../../types/markers';
// component
import { Modal, ModalInfo } from '../../components/Modals';
//redux toolkit
import { useAppDispatch } from '../../App';
import { setMarkers } from '../../store/markerSlice';
// react query
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';

interface TokenType {
  token?: string | null;
}

const Main = () => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  // react query 데이터 불러오기
  const { isFetching, data, refetch, isError } = useQuery(
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

  const getToken = localStorage.getItem('token');
  const tokenData: TokenType = { token: getToken };
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [markerData, setMarkerData] = useState<MarkerData | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // setMarkers에 useQuery로 불러온 마커 데이터 저장
  useEffect(() => {
    dispatch(setMarkers(data));
  }, [data]);

  // 회원 탈퇴 요청
  const deleteMutation = useMutation(
    (tokenData: TokenType) =>
      axios.delete(`${URL}/delete`, {
        headers: { Authorization: `Bearer ${tokenData.token}` },
      }),
    {
      onSuccess: (data) => {
        if (data.status === 200) {
          alert('탈퇴가 완료되었습니다.');
          localStorage.removeItem('token');
          navigate('/');
        }
      },
      onError: () => {
        alert('에러가 발생했습니다. 다시 시도해주세요.');
      },
    }
  );

  const handleClickDelete = () => {
    if (tokenData) {
      deleteMutation.mutate(tokenData);
    }
  };

  const deleteUserModal: ModalInfo = {
    content: '정말 회원을 탈퇴하시겠습니까?',
    btntext: '탈퇴하기',
    lonclick: () => setDeleteModal((close) => !close),
    ronclick: () => {
      setDeleteModal((close) => !close);
      handleClickDelete();
    },
  };

  return (
    <>
      {deleteModal ? <Modal info={deleteUserModal} /> : null}
      <Map />
      <span
        onClick={() => setDeleteModal(true)}
        className="absolute bottom-0 right-0 pb-5 pr-12 cursor-pointer text-sm text-zinc-400"
      >
        회원 탈퇴
      </span>
    </>
  );
};

export default Main;
