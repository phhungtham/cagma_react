import { useEffect } from 'react';
/**
 * This hook accepts a list of functions to fetch data once when component mounting
 * Each item of the fetch action conform the format { fetchAction: <ref-of-fetch-action>, args: any[] } strictly
 * Note: The order of items in args follow the order of argurments of fetch action function
 * @param {array<{fetchAction: (...args: any[]) => void, args: any[]}>} fetchActions An array of actions we want to fetch data at page/screen mounted phase
 * @return void
 */
const useFetchesOnce = fetchActions => {
  useEffect(() => {
    (fetchActions || []).forEach(({ fetchAction, args = [] }) => {
      fetchAction(...args);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useFetchesOnce;
