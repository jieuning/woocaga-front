import './style/App.css';
import { initialType } from './types/markers';
// 컴포넌트
import { Header } from './components/Header';
import { Map } from './components/Map';
// 리덕스
import { useSelector } from 'react-redux';

const App = () => {
  const data = useSelector((state: { markers: initialType }) => state.markers);

  return (
    <div className="font-spoqa bg-ivory h-screen">
      <Header />
      <Map data={data} />
    </div>
  );
};

export default App;
