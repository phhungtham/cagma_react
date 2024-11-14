import { useNavigate } from 'react-router-dom';

//TODO: Test after UAT Phase 1
//For refresh navigate history
//Check case move next to native screen or websquare screen and back to React screen.
const useMove = () => {
  const navigate = useNavigate();

  const moveNext = ({ menuCode, params, reactPath }) => {
    moveNext(menuCode, params ? { param: JSON.stringify(params) } : {}, reactPath);
    navigate('/');
  };

  const moveHome = () => {
    moveHome();
    navigate('/');
  };

  return { moveNext, moveHome };
};

export default useMove;
