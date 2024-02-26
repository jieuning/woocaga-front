import { Map } from '../../components/Map';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// component
import { Modal, ModalInfo } from '../../components/Modals';
// react query
import { useMutation } from 'react-query';
import axios from 'axios';

interface TokenType {
  token?: string | null;
}

const Main = () => {
  const getToken = localStorage.getItem('token');
  const tokenData: TokenType = { token: getToken };
  console.log(getToken);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;

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
      onError: (error: Error) => {
        alert('에러가 발생했습니다.');
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
