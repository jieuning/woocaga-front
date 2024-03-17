import close_btn from '../assets/close.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// components
import { Withdrawal } from './Withdrawal';
import { MyMarkers } from './MyMarkers';
import { Modal, ModalInfo } from './Modals';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { deleteToken } from '../store/userSlice';
import { setUserToken } from '../store/userSlice';

export const UserMenu = () => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userData = useAppSelector((state) => state.user);

  const [userMenu, setUserMenu] = useState<boolean>(false);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const [openMyMarkers, setOpenMyMarkers] = useState<boolean>(false);
  const [extendLoginModal, setExtendLoginModal] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);

  const refreshToken = async () => {
    try {
      // 서버에 새로운 토큰 요청
      const response = await axios.post(
        `${URL}/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${userData.token}` },
        }
      );
      const data = response.data;
      if (response.status === 200) {
        dispatch(setUserToken(data.newAccessToken));
      }
    } catch (error) {
      console.error('토큰 갱신에 실패했습니다:', error);
      if (error) {
        dispatch(deleteToken());
        alert('에러가 발생해 로그아웃 되었습니다. 다시 로그인해주세요.');
        navigate('/');
      }
    }
  };

  const intervalTime = 170 * 60 * 1000;
  const logoutDelay = 30 * 1000;

  // 2시간 30분 후에 모달창
  // 모달창 뜨고 30초 후에 자동 로그아웃
  const autoLogoutTimer = () => {
    setTimer(
      setTimeout(
        () => {
          setExtendLoginModal(true);
          setTimer(
            setTimeout(() => {
              dispatch(deleteToken());
              navigate('/');
              setExtendLoginModal(false);
            }, logoutDelay)
          );
        },
        intervalTime - 30 * 1000
      )
    );
  };

  // 로그인 연장시 현재 타이머 클리어
  const resetTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
    }
  };

  useEffect(() => {
    if (userData.token !== '') {
      autoLogoutTimer();
    }
    return () => {
      clearTimeout(timer);
    };
  }, [userData.token]);

  const extendLoginInfo: ModalInfo = {
    content: '로그인을 연장하시겠습니까?\n30초 후에 자동으로 로그아웃됩니다.',
    btntext: '예',
    lonclick: () => {
      dispatch(deleteToken());
      navigate('/');
      setExtendLoginModal((close) => !close);
    },
    ronclick: () => {
      refreshToken();
      resetTimer();
      setExtendLoginModal((close) => !close);
    },
  };

  const logoutModalInfo: ModalInfo = {
    content: '정말 로그아웃 하시겠습니까?',
    btntext: '로그아웃',
    lonclick: () => {
      setLogoutModal((close) => !close);
    },
    ronclick: () => {
      dispatch(deleteToken());
      navigate('/');
      setLogoutModal((close) => !close);
    },
  };
  return (
    <>
      {extendLoginModal && <Modal info={extendLoginInfo} />}
      {logoutModal && <Modal info={logoutModalInfo} />}
      {openMyMarkers && <MyMarkers setOpenMyMarkers={setOpenMyMarkers} />}
      <div
        onClick={() => setUserMenu((open) => !open)}
        className="transition-all hover:text-brown cursor-pointer max-md:text-xs"
      >
        {userData.email}님
      </div>
      <nav
        className={`${!userMenu ? 'hidden' : 'block'} absolute top-11 right-12 max-md:right-2.5 w-44 p-2.5 bg-white rounded-md border border-primary cursor-default`}
      >
        <img
          onClick={() => setUserMenu((close) => !close)}
          className="absolute right-0 top-0 pr-2.5 pt-2.5 cursor-pointer"
          src={close_btn}
          alt="닫기 버튼"
        />
        <div className="flex flex-col items-center gap-2.5">
          <p
            className="text-black hover:text-brown cursor-pointer"
            onClick={() => {
              setLogoutModal((open) => !open);
              setUserMenu((close) => !close);
            }}
          >
            로그아웃
          </p>
          <p
            onClick={() => {
              setUserMenu((close) => !close);
              setOpenMyMarkers(true);
            }}
            className="text-black hover:text-brown cursor-pointer"
          >
            내 마커보기
          </p>
          <Withdrawal setUserMenu={setUserMenu} />
        </div>
      </nav>
    </>
  );
};
