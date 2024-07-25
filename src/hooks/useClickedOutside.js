import { useEffect } from 'react';

const useClickedOutside = elementRef => {
  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        elementRef.current.style.display = 'none';
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [elementRef]);
};
export default useClickedOutside;
