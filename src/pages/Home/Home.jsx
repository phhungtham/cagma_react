import { useEffect } from 'react';

import { delay } from '@common/constants/common';
import setHybridReady from '@utilities/gmCommon/setHybridReady';

import './Home.scss';

export default function App() {
  const initReactView = async retries => {
    try {
      setHybridReady();
    } catch (error) {
      if (retries > 0) {
        await delay(500);
        return await initReactView(retries - 1);
      }
    }
  };
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      // 2023/07/07  Yen, KHGMA-2035. Run this on mobile only. Not run on Mac Mini enviroment
      initReactView(1000); // waiting for wmatrix.js load successfully, so that window.wmatrix.exec can run, 2023/07/07  Yen, KHGMA-2035
    }
  }, []);

  return <div />;
}
