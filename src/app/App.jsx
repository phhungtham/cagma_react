/* eslint-disable no-unused-vars */
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Routes, useNavigate } from 'react-router-dom';

import { TooltipProvider } from '@common/components/atoms/Tooltip/TooltipContext';
import ErrorBoundary from '@common/components/ErrorBoundary';
import Fallback from '@common/components/Fallback';
import { AppCfg } from '@configs/appConfigs';
import useReducers from '@hooks/useReducers';
import privateRoutes from '@routes/service/private-routes';
import publicRoutes from '@routes/service/public-routes';
import { languageStorageKeys } from '@utilities/transform';
import { reloadLanguageResource } from 'i18n/reloadLanguageResource';
import { $h, wmatrix } from 'navigation/wmatrix_config';
import { polyfill } from 'smoothscroll-polyfill';
import { localStorageService } from 'storage';

import { deviceDetected } from '../utilities';
import './App.scss';
import {
  setAppPath,
  setCurrentLanguage,
  setInitLoginState,
  setIsNativeClickBack,
  setIsNativeRedirect,
  setNativeParams,
} from './redux/action';
import { appGlobalReducer } from './redux/reducer';
import { appLanguage } from './redux/selector';
import { APP_GLOBAL } from './redux/type';

const App = () => {
  useReducers([{ key: APP_GLOBAL, reducer: appGlobalReducer }]);
  const navigate = useNavigate();
  const currentLanguage = useSelector(appLanguage);
  const { i18n } = useTranslation();

  const scriptLoad = async isMobileDevice => {
    if (AppCfg.ENV === 'development') return;
    if (isMobileDevice) {
      const script = document.createElement('script');
      script.src = '../../../../wmatrix.js';
      script.async = true;
      script.onload = () => {
        wmatrix = window.wmatrix;
        $h = window.$h;
        $h.dismissScreen();
      };
      document.body.appendChild(script);
    } else {
      return isMobileDevice;
    }
  };

  const getLanguageFile = async () => {
    if (!currentLanguage || currentLanguage === 'undefined') return;
    const url = `../../../../websquare/langpack/161_${currentLanguage}.js`;
    await fetch(url)
      .then(response => response.text())
      .then(data => {
        // ignore text 'Websquare.WebsquareLang = '
        let firstLanguageContentIndex = data.indexOf('{');
        let lastLanguageContent = data.charAt(data.length - 1);
        if (lastLanguageContent === ';') {
          data = data.substring(0, data.length - 1);
        }
        let langpack = data.substring(firstLanguageContentIndex, data.length);
        localStorageService.setLang(JSON.parse(langpack), languageStorageKeys(currentLanguage));
        reloadLanguageResource(currentLanguage);
      })
      .then(() => {
        i18n.changeLanguage(currentLanguage);
      });
  };

  useEffect(() => {
    const isMobileDevice = deviceDetected();
    scriptLoad(isMobileDevice);
  }, []);

  useEffect(() => {
    // Native redirect event...
    /**
     * const detail = {
     * src: "", //path
     * param: {
     *  ums_svc_c: "",
     *  ....other param
     * }
     * }
     */
    document.addEventListener(
      'redirect',
      e => {
        try {
          if (typeof e.detail === 'object') {
            const data = e.detail;
            const path = String(data.src);
            if (path === '/notification') {
              setInitLoginState('');
            }
            navigate(path);
            setAppPath(path);
            // get param from native side
            const params = JSON.parse(data.param);
            setNativeParams(params);
          }
        } catch (error) {}
        setIsNativeRedirect();
      },
      false
    );
  }, []);

  useEffect(() => {
    // Get current language from native..
    document.addEventListener(
      'changeLanguage',
      e => {
        const language = String(e.detail);
        // changeAppFont(language);
        setCurrentLanguage(language);
        localStorageService.setLanguageCode(language);
      },
      false
    );

    // Catch back event from native...
    document.addEventListener(
      'onClickBack',
      e => {
        const isClickBack = String(e.detail);
        setIsNativeClickBack(isClickBack);
      },
      false
    );
  }, []);

  useEffect(() => {
    getLanguageFile();
  }, [currentLanguage]);

  useEffect(() => {
    polyfill();
    // for development
    if (process.env.NODE_ENV === 'development') {
      // setAppPath(window.location.pathname);
    }
  }, []);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className="bg-white">
          <Suspense fallback={<Fallback />}>
            <Routes>
              {privateRoutes()}
              {publicRoutes()}
            </Routes>
          </Suspense>
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
};
export default App;
