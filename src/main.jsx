import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { StateProvider } from './context/StateContext.jsx';
import { I18nProvider } from './utils/i18n.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <StateProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </StateProvider>
  </React.StrictMode>
);
