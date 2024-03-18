import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';
// components
import { UserMenu } from './UserMenu';
// redux
import { useAppSelector } from '../App';

export const Header = () => {
  const userData = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <>
      <section className="sticky top-0 w-full py-4 max-md:py-3 bg-primary flex items-center justify-between px-12 z-30 max-lg:px-2.5">
        <img
          onClick={() => navigate(`${!userData.token ? '/' : '/main'}`)}
          className="w-32 max-md:w-24 cursor-pointer"
          src={logo}
          alt="로고"
        />
        <div className="text-white text-sm">
          {userData.token === '' ? (
            <span
              className="font-semibold cursor-pointer"
              onClick={() => navigate('/login')}
            >
              로그인
            </span>
          ) : (
            <UserMenu />
          )}
        </div>
      </section>
    </>
  );
};
