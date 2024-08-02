import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@shared/redux/store';
import { AppCfg } from '@configs/appConfigs';
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
const RouterComponent = AppCfg.ENV === 'development' || AppCfg.ENV === 'dev' ? BrowserRouter : Router;
root.render(
  <RouterComponent>
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  </RouterComponent>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
