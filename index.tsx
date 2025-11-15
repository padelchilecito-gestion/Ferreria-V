import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'; // 1. Importar Provider
import { store } from './store'; // 2. Importar nuestro store

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 3. Envolver App con el Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
