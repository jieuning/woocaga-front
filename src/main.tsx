import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import './style/index.css';
// redux tookit
import { Provider } from 'react-redux';
import store from './store/index.ts';
// persist
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
// react query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const persistor = persistStore(store);
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </BrowserRouter>
);
