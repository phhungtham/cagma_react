import ReactDOM from 'react-dom/client';
import { pdfjs } from 'react-pdf';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter as Router } from 'react-router-dom';

import { AppCfg } from '@configs/appConfigs';
import store from '@shared/redux/store';

import App from './app/App';
import './i18n';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
const RouterComponent = AppCfg.ENV === 'development' || AppCfg.ENV === 'dev' ? BrowserRouter : Router;
root.render(
  <RouterComponent>
    <Provider store={store}>
      <App />
    </Provider>
  </RouterComponent>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
