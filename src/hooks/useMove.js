import { useNavigate } from 'react-router-dom';

import { clearHistory, moveBack, moveHome, moveNext } from '@utilities/index';
import homeAndLogin from '@utilities/navigateScreen/homeAndLogin';

//For refresh navigate history
//Check case move next to native screen or websquare screen and back to React screen.
//TODO: Check case move next to other screen Native or Websquare. Should we navigate to home?
const useMove = () => {
  const navigate = useNavigate();

  const moveScreenNative = (menuCode, params, reactPath) => {
    moveNext(menuCode, params, reactPath);
    navigate('/');
  };

  const moveHomeNative = () => {
    moveHome();
    navigate('/');
  };

  const moveInitHomeNative = () => {
    moveHome('initHome');
    navigate('/');
  };

  const moveBackNative = () => {
    moveBack();
    navigate('/');
  };

  const moveHomeAndLoginNative = () => {
    homeAndLogin();
    navigate('/');
  };

  const clearHistoryNative = (menuCode, params, reactPath) => {
    clearHistory(menuCode, params);
    navigate('/');
  };

  return {
    moveScreenNative,
    moveHomeNative,
    moveBackNative,
    moveInitHomeNative,
    moveHomeAndLoginNative,
    clearHistoryNative,
  };
};

export default useMove;
