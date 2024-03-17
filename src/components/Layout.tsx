import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen bg-ivory">
      <Header />
      <main className="font-spoqa bg-ivory w-full h-full">
        <div className="w-full h-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
