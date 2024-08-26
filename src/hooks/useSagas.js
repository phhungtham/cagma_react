import { useEffect } from 'react';

import store from 'shared/redux/store';

/**
 * This hook is used to hook up sagas that handle the asynchronous actions for the page/screen/route
 * It will be unhooked once user navigate to another page/screen/route automatically
 * @param {Array<object>} sagas The list of sagas to handle Asynchronous actions on the specific page/screen/route
 * Each item conform the format { key: string, saga: generator function }
 */
const useSagas = sagas => {
  useEffect(() => {
    store.sagaManager.injectSagas(sagas);
    // we only want it run once before leaving the current page
    return () => {
      const keys = sagas.map(item => item.key);
      store.sagaManager.ejectSagas(keys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useSagas;
