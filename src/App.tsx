import './style/App.css';
import { Header } from './components/Header';
import { Map } from './components/Map';
import { CafeData } from './types/cafes';
import dummyData from './dummy/data.json';

const App = () => {
  const cafeData: CafeData = {
    cafes: dummyData.cafes,
  };

  return (
    <div className="font-spoqa bg-ivory h-screen">
      <Header />
      <Map data={cafeData} />
    </div>
  );
};

export default App;
