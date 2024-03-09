import { useEffect, useState } from 'react';
import { Modal, ModalInfo } from './Modals';
import { useNavigate } from 'react-router-dom';
import { UserDataType } from '../types/markers';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { deleteToken } from '../store/userSlice';
// react query
import { useMutation } from 'react-query';
import axios from 'axios';

export const Withdrawal = () => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [withdrawal, setWithdrawal] = useState<boolean>(false);

  // 회원 탈퇴 요청
  const deleteMutation = useMutation(
    (userData: UserDataType) =>
      axios.delete(`${URL}/delete`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      }),
    {
      onSuccess: (data) => {
        if (data.status === 200) {
          alert('탈퇴가 완료되었습니다.');
          dispatch(deleteToken());
          navigate('/');
        }
      },
      onError: () => {
        alert('에러가 발생했습니다. 다시 시도해주세요.');
      },
    }
  );

  const handleClickDelete = () => {
    if (userData) {
      deleteMutation.mutate(userData);
    }
  };

  const withdrawalModal: ModalInfo = {
    content: '정말 회원을 탈퇴하시겠습니까?',
    btntext: '탈퇴하기',
    lonclick: () => setWithdrawal((close) => !close),
    ronclick: () => {
      setWithdrawal((close) => !close);
      handleClickDelete();
    },
  };
  return (
    <>
      {withdrawal ? <Modal info={withdrawalModal} /> : null}
      <p
        onClick={() => {
          setWithdrawal((open) => !open);
        }}
        className="absolute left-1/2 bottom-0 -translate-x-1/2 pb-2.5 cursor-pointer text-zinc-400"
      >
        회원 탈퇴
      </p>
    </>
  );
};
