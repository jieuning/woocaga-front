import './style/App.css';
import { Routes, Route } from 'react-router-dom';
// 헤더
import { Header } from './components/Header';
// 페이지
import Intro from './pages/intro';
import Main from './pages/main';
import Register from './pages/register';
import Login from './pages/login';
// redux
import { useSelector, useDispatch } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

declare global {
  interface Window {
    kakao: any;
  }
}

export const kakao: any = window['kakao'];

// 매번 type을 지정해주지 않아도 된다.
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const App = () => {
  return (
    <div className="font-spoqa bg-ivory h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/main" element={<Main />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
