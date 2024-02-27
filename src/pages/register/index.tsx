import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// react query
import { useMutation } from 'react-query';
import axios from 'axios';

interface formDataType {
  email: string;
  password: string;
  passwordConfirm: string;
}

interface newUserType {
  email: string;
  password: string;
}

const Register = () => {
  const [formData, setFormData] = useState<formDataType>({
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const URL = `${import.meta.env.VITE_WOOCAGA_API_URL}`;
  const registerMutation = useMutation(
    (newUser: newUserType) => axios.post(`${URL}/register`, newUser),
    {
      onSuccess: (data) => {
        alert(`${data.data.email}님 가입이 완료되었습니다. 환영합니다!!🎉`);
        navigate('/login');
      },
      onError: (error: Error) => {
        if (error.message === 'Request failed with status code 409') {
          setErrors((prevErrors) => [
            ...prevErrors,
            '이미 가입된 이메일 입니다.',
          ]);
        }
      },
    }
  );

  const handleChange = (event: any) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setErrors([]);

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrors((prevErrors) => [
        ...prevErrors,
        '올바른 이메일 형식이 아닙니다.',
      ]);
    }

    // 비밀번호 일치 여부 확인
    if (formData.password !== formData.passwordConfirm) {
      setErrors((prevErrors) => [
        ...prevErrors,
        '비밀번호가 일치하지 않습니다.',
      ]);
      return;
    }

    // 비밀번호 길이 및 특수 문자 포함 여부 확인
    if (formData.password.length < 6) {
      setErrors((prevErrors) => [
        ...prevErrors,
        '비밀번호는 6자 이상이어야 합니다.',
      ]);
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      setErrors((prevErrors) => [
        ...prevErrors,
        '비밀번호에 특수 문자가 포함되어야 합니다.',
      ]);
    }

    // 빈칸 검사
    if (!formData.email || !formData.password || !formData.passwordConfirm) {
      setErrors((prevErrors) => [...prevErrors, '모든 칸을 입력해주세요.']);
      return;
    }

    if (errors.length === 0) {
      const newUser: newUserType = {
        email: formData.email,
        password: formData.password,
      };

      if (newUser) {
        registerMutation.mutate(newUser);
      }
    }
  };

  return (
    <section className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex items-center flex-col gap-12">
        <h2 className="text-2xl text-brown font-bold">회원가입</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-96 rounded-lg p-3 outline-primary text-sm tracking-tighter"
            placeholder="이메일을 입력해주세요"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-96 rounded-lg p-3 outline-primary text-sm tracking-tighter"
            placeholder="비밀번호를 입력해주세요(6자리 이상, 특수문자 포함)"
          />
          <input
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            className="w-96 rounded-lg p-3 outline-primary text-sm tracking-tighter"
            placeholder="비밀번호를 다시 입력해주세요(6자리 이상, 특수문자 포함)"
          />
          {errors.length > 0 && (
            <div className="text-red-500">
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="submit"
            className={`${formData.email && formData.password && formData.passwordConfirm ? 'disabled-button' : 'share-button'} w-96 p-3`}
          >
            가입하기
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
