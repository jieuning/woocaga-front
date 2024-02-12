import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style/index.css';
// redux tookit
import { Provider } from 'react-redux';
import store from './store/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
