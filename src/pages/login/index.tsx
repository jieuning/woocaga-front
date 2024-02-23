const Login = () => {
  return (
    <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center flex-col gap-12">
        <h2 className="text-2xl text-brown font-bold">로그인</h2>
        <div className="flex flex-col gap-5">
          <input
            className="w-96 rounded-lg p-3 outline-primary"
            placeholder="이메일을 입력해주세요"
          />
          <input
            className="w-96 rounded-lg p-3 outline-primary"
            placeholder="비밀번호를 입력해주세요"
          />
          <button className="share-button w-96 p-3">로그인하기</button>
        </div>
      </div>
    </section>
  );
};

export default Login;
