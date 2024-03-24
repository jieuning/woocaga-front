import introLogo from '../../assets/intro_logo.png';
import bean from '../../assets/bean1.png';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector } from '../../App';

const Intro = () => {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.user.token);

  // 첫 렌더링시 token있으면 main으로 이동
  useEffect(() => {
    if (token) {
      navigate('/main');
    }
  }, []);

  return (
    <section className="w-full intro-height bg-intro-bg bg-cover bg-no-repeat bg-center">
      <div className="relative top-1/2 -translate-y-1/2 flex items-center flex-col">
        <h2 className="text-[22px] max-md:text-[18px] text-black font-medium pb-6 text-center break-keep leading-8">
          건대 주민들을 위한
          <br />
          우리동네 &nbsp;
          <span className="text-primary">카페 맛집</span>
          &nbsp;가이드
        </h2>
        <div className="flex flex-col items-center">
          <img className="pb-8 w-20" src={bean} alt="커피빈 이미지" />
          <img className="pb-14 w-28" src={introLogo} alt="로고" />
        </div>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/register')}
            className="share-button bg-primary w-56 py-2.5"
          >
            시작하기
          </button>
          <button
            onClick={() => navigate('/login')}
            className="share-button bg-lightbrown w-56 py-2.5"
          >
            로그인하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Intro;
