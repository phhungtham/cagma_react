import { useNavigate } from 'react-router-dom';

import { moveBack, moveHome, moveNext } from '@utilities/index';

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

  const moveBackNative = () => {
    moveBack();
    navigate('/');
  };

  return { moveScreenNative, moveHomeNative, moveBackNative };
};

export default useMove;
