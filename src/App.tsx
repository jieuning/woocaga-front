import './style/App.css';
// 컴포넌트
import { Header } from './components/Header';
import { Map } from './components/Map';

const App = () => {
  return (
    <div className="font-spoqa bg-ivory h-screen">
      <Header />
      <Map />
    </div>
  );
};

export default App;
