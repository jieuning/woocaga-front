import { useState } from 'react';
import { Modal, ModalInfo } from './Modals';
import { useNavigate } from 'react-router-dom';
import { UserDataType } from '../types/markers';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { deleteToken } from '../store/userSlice';
// react query
import { useMutation } from 'react-query';
import axios from 'axios';

interface withdrawalProps {
  setUserMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Withdrawal = ({ setUserMenu }: withdrawalProps) => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}/delete`;
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [withdrawal, setWithdrawal] = useState<boolean>(false);

  // 회원 탈퇴 요청
  const deleteMutation = useMutation(
    (userData: UserDataType) =>
      axios.delete(URL, {
        headers: { Authorization: `Bearer ${userData.token}` },
      }),
    {
      onSuccess: (data) => {
        if (data.status === 200) {
          setUserMenu((close) => !close);
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
        className="cursor-pointer text-zinc-400"
      >
        회원 탈퇴
      </p>
    </>
  );
};
