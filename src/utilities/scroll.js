export const scrollToElement = (targetRef, containerRef, headerSelector, anchorSelector) => {
  if (!containerRef || !targetRef) return;
  const headerHeight = document.querySelector(headerSelector)?.offsetHeight || 59;
  const anchorHeight = document.querySelector(anchorSelector)?.offsetHeight || 0;

  const containerElement = containerRef.current || containerRef;
  const targetElement = targetRef.current || targetRef;

  if (!containerElement || !targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + containerElement?.scrollTop;
  containerElement.scrollTo({
    top: targetPosition - headerHeight - anchorHeight,
    behavior: 'smooth',
  });
};

export const isScrolledToBottom = element => {
  if (element) {
    //TODO: Just for reissue card return client height of bottom sheet view term container is 0. Check later
    if (element.clientHeight === 0) {
      return false;
    }
    return element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
  }
  return true;
};
