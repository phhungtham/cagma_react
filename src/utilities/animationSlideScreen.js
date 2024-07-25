export const animationSlideScreen = (slideDirection = 'right') => {
  const animationDiv = document.querySelector('.slide-animation');
  const slideClass = `slide-${slideDirection}`;
  animationDiv.classList.add(slideClass);
  animationDiv.addEventListener('animationend', function () {
    animationDiv.classList.remove(slideClass);
  });
};
