export const cookieGetter = () => {
  const cookie = document.cookie.split(';').filter(cookie => cookie.includes(''));
  return cookie.length > 0 ? true : false;
};
