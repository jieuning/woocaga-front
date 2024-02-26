import { useState } from 'react';
import logo from '../assets/logo.png';
import { Modal, ModalInfo } from './Modals';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const token = localStorage.getItem('token');
  const [headerModal, setHeaderModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const logoutModalInfo: ModalInfo = {
    content: '정말 로그아웃 하시겠습니까?',
    btntext: '로그아웃',
    lonclick: () => setHeaderModal((close) => !close),
    ronclick: () => {
      localStorage.removeItem('token');
      setHeaderModal((close) => !close);
      navigate('/');
    },
  };

  return (
    <>
      {headerModal ? <Modal info={logoutModalInfo} /> : null}
      <section className="fixed w-full h-14 bg-primary flex items-center justify-between px-12">
        <img
          onClick={() => navigate(`${!token ? '/' : '/main'}`)}
          className="w-32 cursor-pointer"
          src={logo}
          alt="로고"
        />
        <div className="text-white text-sm font-semibold cursor-pointer">
          {!token ? (
            <span onClick={() => navigate('/login')}>로그인</span>
          ) : (
            <span onClick={() => setHeaderModal(true)}>로그아웃</span>
          )}
        </div>
      </section>
    </>
  );
};
