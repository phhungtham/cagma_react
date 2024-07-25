import { useEffect } from 'react';

const useFocus = fieldName => {
  useEffect(() => {
    const element = document.querySelector([`[name='${fieldName}']`]);
    if (!element) return;
    element.focus();
  }, [fieldName]);
};
export default useFocus;
