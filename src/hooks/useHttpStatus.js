import { selectHttpStatus } from 'shared/features/http';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

/********************************************
 * This hook is used to watch the HTTP Status of request to server by Action Type
 * This allows user handle things like showing requesting indicator
 * actionType: string such as account/GET_ACCOUNT, etc.
 * @param {string} actionType The Action Type we want to watch the Http response
 * @returns An Object conforms the following format : { status: string, errors: array<any> }
 */
const useHttpStatus = actionType => {
  const getHttpStatus = useMemo(() => selectHttpStatus(actionType), [actionType]);
  const status = useSelector(getHttpStatus);
  return status;
};

export default useHttpStatus;
