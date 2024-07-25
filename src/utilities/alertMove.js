import moveHome from './navigateScreen/home';

export const alertMove = resCode => {
  // GIB.0002 resCode required login..
  if (resCode === 'GIB.0002') {
    moveHome('initHome');
  } else {
    moveHome();
  }
};
