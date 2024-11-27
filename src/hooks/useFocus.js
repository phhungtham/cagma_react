const useFocus = () => {
  const focusField = fieldName => {
    const element = document.querySelector([`[name='${fieldName}']`]);
    if (!element) return;
    element?.focus();
  };

  return { focusField };
};
export default useFocus;
