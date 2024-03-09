import logo from '../assets/logo.png';
import close_btn from '../assets/close.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// components
import { Modal, ModalInfo } from './Modals';
import { Withdrawal } from './Withdrawal';
// redux
import { useAppDispatch, useAppSelector } from '../App';
import { setUserToken, deleteToken } from '../store/userSlice';

export const Header = () => {
  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const userData = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [headerModal, setHeaderModal] = useState<boolean>(false);
  const [userMenu, setUserMenu] = useState<boolean>(false);
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
        dispatch(setUserToken(data.accessToken));
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

  const intervalTime = 180 * 60 * 1000;
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

  const logoutModalInfo: ModalInfo = {
    content: '정말 로그아웃 하시겠습니까?',
    btntext: '로그아웃',
    lonclick: () => {
      setHeaderModal((close) => !close);
    },
    ronclick: () => {
      dispatch(deleteToken());
      navigate('/');
      setHeaderModal((close) => !close);
    },
  };

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

  return (
    <>
      {headerModal && <Modal info={logoutModalInfo} />}
      {extendLoginModal && <Modal info={extendLoginInfo} />}
      <section className="fixed w-full h-14 bg-primary flex items-center justify-between px-12 z-40">
        <img
          onClick={() => navigate(`${!userData.token ? '/' : '/main'}`)}
          className="w-32 cursor-pointer"
          src={logo}
          alt="로고"
        />
        <div className="text-white text-sm font-semibold cursor-pointer">
          {userData.token === '' ? (
            <span onClick={() => navigate('/login')}>로그인</span>
          ) : (
            <>
              <div
                onClick={() => setUserMenu((open) => !open)}
                className="transition-all hover:text-brown"
              >
                {userData.email}님
              </div>
              <nav
                className={`${!userMenu ? 'hidden' : 'block'} absolute top-11 right-12 w-44 h-32 p-2.5 pt-5 bg-white rounded-md border border-primary cursor-default`}
              >
                <img
                  onClick={() => setUserMenu((close) => !close)}
                  className="absolute right-0 top-0 pr-2.5 pt-2.5 cursor-pointer"
                  src={close_btn}
                  alt="닫기 버튼"
                />
                <div className="flex flex-col items-center gap-2.5">
                  <p className="text-black hover:text-brown cursor-pointer">
                    내 마커 보기
                  </p>
                  <p
                    className="text-black hover:text-brown cursor-pointer"
                    onClick={() => {
                      setHeaderModal((open) => !open);
                      setUserMenu((close) => !close);
                    }}
                  >
                    로그아웃
                  </p>
                  <Withdrawal />
                </div>
              </nav>
            </>
          )}
        </div>
      </section>
    </>
  );
};
