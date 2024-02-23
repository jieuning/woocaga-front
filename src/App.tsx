import './style/App.css';
// 컴포넌트
import { Header } from './components/Header';
import { Map } from './components/Map';
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
      <Map />
    </div>
  );
};

export default App;
