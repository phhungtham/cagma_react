import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import BottomSheet from '@common/components/templates/BottomSheet';
import { getIntendedUseAccountCode } from '@common/constants/commonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { PropTypes } from 'prop-types';

import { getIntendedUseAccountRequest } from '../../redux/intendedUseAccount/action';
import { intendedUseAccountReducer } from '../../redux/intendedUseAccount/reducer';
import { intendedUseAccountSaga } from '../../redux/intendedUseAccount/saga';
import { intendedUseAccountList, intendedUseAccountLoadState } from '../../redux/intendedUseAccount/selector';
import { IntendedUseAccountFeatureName } from '../../redux/intendedUseAccount/type';
import './styles.scss';

const IntendedUseOfAccountBottom = ({ open, onClose, onSelect }) => {
  useReducers([{ key: IntendedUseAccountFeatureName, reducer: intendedUseAccountReducer }]);
  useSagas([{ key: IntendedUseAccountFeatureName, saga: intendedUseAccountSaga }]);
  const intendedUseAccounts = useSelector(intendedUseAccountList);
  const isLoadingRequest = useSelector(intendedUseAccountLoadState);
  const intendedUseOfAccountsConverted = (intendedUseAccounts || []).map(item => {
    return { value: item.key, label: item.value };
  });

  const onSelectIntended = item => {
    onSelect(item);
  };

  useEffect(() => {
    if (open && !intendedUseAccounts?.length) {
      getIntendedUseAccountRequest({ code: getIntendedUseAccountCode });
    }
  }, [open]);

  return (
    <>
      {isLoadingRequest ? (
        <Spinner />
      ) : (
        <BottomSheet
          open={open}
          onClose={onClose}
          title="Intended use of account"
          clazz="intended-use-account-bottom__wrapper"
          type="max-scroll"
        >
          <div className="intended-use-account__content">
            <div className="intended-use-account__list">
              {intendedUseOfAccountsConverted?.length > 0 ? (
                intendedUseOfAccountsConverted.map(item => (
                  <div
                    className="intended__item"
                    key={item.value}
                    onClick={() => onSelectIntended(item)}
                  >
                    <div className="intended__item__main">
                      <div className="intended__label">{item.label}</div>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </BottomSheet>
      )}
    </>
  );
};

IntendedUseOfAccountBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

IntendedUseOfAccountBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
};

export default IntendedUseOfAccountBottom;
