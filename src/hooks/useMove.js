import { useNavigate } from 'react-router-dom';

import { moveBack, moveHome, moveNext } from '@utilities/index';
import homeAndLogin from '@utilities/navigateScreen/homeAndLogin';

//For refresh navigate history
//Check case move next to native screen or websquare screen and back to React screen.
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

  return { moveScreenNative, moveHomeNative, moveBackNative, moveInitHomeNative, moveHomeAndLoginNative };
};

export default useMove;
