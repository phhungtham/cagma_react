/* eslint-disable no-unused-vars */
import { Suspense, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Routes, useNavigate } from 'react-router-dom';

import { TooltipProvider } from '@common/components/atoms/Tooltip/TooltipContext';
import ErrorBoundary from '@common/components/ErrorBoundary';
import Fallback from '@common/components/Fallback';
import { AppCfg } from '@configs/appConfigs';
import useApi from '@hooks/useApi';
import useReducers from '@hooks/useReducers';
import privateRoutes from '@routes/service/private-routes';
import publicRoutes from '@routes/service/public-routes';
import { isGapSupported } from '@utilities/polyfillFlexGap';
import { languageStorageKeys } from '@utilities/transform';
import { tryCatch } from '@utilities/tryCatch';
import { reloadLanguageResource } from 'i18n/reloadLanguageResource';
import { $h, wmatrix } from 'navigation/wmatrix_config';
import { polyfill } from 'smoothscroll-polyfill';
import { localStorageService } from 'storage';

import { deviceDetected } from '../utilities';
import './App.scss';
import {
  setAppPath,
  setCurrentLanguage,
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
  const { requestApi } = useApi();

  //Fix for old browser version. <= IOS 14 || Android 10
  const isBrowserSupportFlexGap = useMemo(() => {
    return isGapSupported();
  }, []);

  const scriptLoad = async isMobileDevice => {
    if (AppCfg.ENV === 'development') return;
    if (isMobileDevice) {
      const script = document.createElement('script');
      script.src = '../../../../wmatrix.js';
      script.async = true;
      script.onload = () => {
        wmatrix = window.wmatrix;
        $h = window.$h;
        if (!$h) {
          console.log('Failed to load script file wmatrix.js onload');
        }
        $h.dismissScreen();
      };
      script.onerror = () => {
        console.log('Failed to load script file wmatrix.js on error');
      };
      document.body.appendChild(script);
    } else {
      return isMobileDevice;
    }
  };

  const getLanguageFile = async () => {
    if (!currentLanguage?.language) return;
    const langStr = currentLanguage.language;
    if (process.env.NODE_ENV === 'development') {
      if (localStorage.getItem(`ca_${langStr}`)) {
        reloadLanguageResource(langStr);
        return;
      }
      const { data } = await requestApi('/gm/co/GMCO005.pwkjson', { appLanguage: langStr });
      if (data?.languageList) {
        const langpack = data.languageList.reduce((acc, cur) => {
          acc[cur.key?.trim()] = cur.value;
          return acc;
        }, {});
        localStorageService.setLang(langpack, languageStorageKeys(langStr));
        reloadLanguageResource(langStr);
      }
      return;
    }
    let url = `../../../../websquare/langpack/511_${langStr}.js`;
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
        localStorageService.setLang(JSON.parse(langpack), languageStorageKeys(langStr));
        reloadLanguageResource(langStr);
      })
      .then(() => {
        i18n.changeLanguage(langStr);
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
            console.log('access redirect event from native');
            console.log('redirect event detail :>> ', e.detail);
            const data = e.detail;
            const path = String(data.src);
            // get param from native side
            const params = tryCatch(JSON.parse, {}, data.param);
            setNativeParams(params);
            navigate(path);
            setAppPath(path);
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
        setCurrentLanguage({ language: language }); //Using object for always trigger get file language when native trigger event
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
    if (process.env.NODE_ENV === 'development') {
      setCurrentLanguage({ language: 'en' });
    }
  }, []);

  return (
    <ErrorBoundary>
      <TooltipProvider>
        <div className={`bg-white ${isBrowserSupportFlexGap ? '' : 'polyfill-browser'}`}>
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
