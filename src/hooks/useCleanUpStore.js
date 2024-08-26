import { useLayoutEffect } from 'react';

/******************************************************
 * This hook accepts a list of cleaning up functions to clean slice of data in store
 * before leaving the current screen/page
 * We want it run once before users navigate to another route(screen/page)
 */
const useCleanUpStore = funcs => {
  useLayoutEffect(() => {
    return () => {
      (funcs || []).forEach(func => func());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCleanUpStore;
