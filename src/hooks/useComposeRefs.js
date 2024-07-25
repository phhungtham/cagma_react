import { useEffect, useRef } from 'react';
/**
 * Hook up the input html element to the controlled react hook form element
 * @param {function} rhfRef The provided ref function by React Hook Form to hook up the element to the form
 * @returns A reference underly HTML Element
 */
const useComposeRefs = rhfRef => {
  const targetRef = useRef();
  useEffect(() => {
    if (typeof rhfRef !== 'function') return;
    rhfRef(targetRef.current);
  }, [rhfRef]);

  return targetRef;
};

export default useComposeRefs;
