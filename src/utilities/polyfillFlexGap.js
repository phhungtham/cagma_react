export const isGapSupported = () => {
  const testElement = document.createElement('div');
  testElement.style.display = 'inline-flex';
  testElement.style.gap = '10px';
  const child1 = document.createElement('div');
  const child2 = document.createElement('div');
  child1.style.width = '10px';
  child1.style.height = '10px';
  child2.style.width = '10px';
  child2.style.height = '10px';
  testElement.appendChild(child1);
  testElement.appendChild(child2);
  document.body.appendChild(testElement);
  const isSupport = testElement.offsetWidth === 30;
  document.body.removeChild(testElement);
  return isSupport;
};
