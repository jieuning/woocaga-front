import './style/App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
//components
import { Layout } from './components/Layout';
// pages
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

const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Intro /> },
      {
        path: '/main',
        element: <Main />,
      },
      { path: '/register', element: <Register /> },
      { path: '/login', element: <Login /> },
    ],
  },
];

const App = () => {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default App;
