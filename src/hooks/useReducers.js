import { useEffect } from 'react';

import store from 'shared/redux/store';

/**
 * This hook is used to hook up the reducers to handle the changes to Store dymanically
 * Reducers will be unhooked once user navigate to another page/screen/route
 * @param {Array<object>} reducers A list of reducers corresponding to handle the changes
 * that we are going to make to Store
 * It conform the format: { key: string, reducer: (state, action) => state }
 * @returns Void
 */

const useReducers = reducers => {
  useEffect(() => {
    store.reducerManager.injectReducers(reducers);
    return () => {
      const keys = reducers.map(item => item.key);
      store.reducerManager.ejectReducers(keys);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useReducers;
