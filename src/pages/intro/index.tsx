import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full h-screen bg-intro-bg bg-cover bg-no-repeat bg-center">
      <div className="relative top-1/2 -translate-y-1/2 flex items-center flex-col">
        <h2 className="text-2xl text-white font-bold mb-32 break-keep leading-6">
          건대 근처&nbsp;
          <span className="text-brown">커피, 디저트</span>
          &nbsp;맛집 가이드를 확인하세요
        </h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/register')}
            className="share-button w-36 h-14"
          >
            가입하기
          </button>
          <p className="text-brown">이미 사용중이라면?</p>
          <button
            onClick={() => navigate('/login')}
            className="share-button w-36 h-14"
          >
            로그인하기
          </button>
        </div>
      </div>
    </section>
  );
};

export default Intro;
