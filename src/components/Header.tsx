import logo from '../assets/logo.png';

export const Header = () => {
  return (
    <section className="fixed w-full h-14 bg-primary flex items-center px-12">
      <img className="w-32" src={logo} alt="로고" />
    </section>
  );
};
