import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './style/index.css';
// redux tookit
import { Provider } from 'react-redux';
import store from './store/index.ts';
// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

export const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
