import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-ivory font-['spoqa']">
      <Header />
      <main className="font-['spoqa'] bg-ivory w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};
