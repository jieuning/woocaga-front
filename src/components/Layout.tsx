import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div>
      <Header />
      <main className="font-spoqa bg-ivory h-screen">
        <Outlet />
      </main>
    </div>
  );
};
