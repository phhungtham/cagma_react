import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import Spinner from '@common/components/atoms/Spinner';
import BottomSheet from '@common/components/templates/BottomSheet';
import { getAccountListRequest } from '@common/redux/accounts/action';
import { accountReducer } from '@common/redux/accounts/reducer';
import { accountSaga } from '@common/redux/accounts/saga';
import { accountList, accountLoadState } from '@common/redux/accounts/selector';
import { FeatureName } from '@common/redux/accounts/type';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { PropTypes } from 'prop-types';

import './styles.scss';

const MyAccountsBottom = ({ open, onClose, onSelect, init = true }) => {
  useReducers([{ key: FeatureName, reducer: accountReducer }]);
  useSagas([{ key: FeatureName, saga: accountSaga }]);

  const accounts = useSelector(accountList);
  const isLoadingGetAccounts = useSelector(accountLoadState);

  const [initParams, setInitParams] = useState(false);

  const onSelectAccount = item => {
    onSelect(item);
  };

  useEffect(() => {
    if (open && !accounts?.length) {
      getAccountListRequest();
    }
  }, [open]);

  useEffect(() => {
    if (accounts?.length && !initParams) {
      const defaultAccount = accounts.find(account => String(account.base_ac_t) === '1');
      if (defaultAccount) {
        setInitParams(true);
        onSelectAccount(defaultAccount);
      }
    }
  }, [accounts]);

  useEffect(() => {
    if (init) {
      getAccountListRequest();
    }
  }, []);

  return (
    <>
      {isLoadingGetAccounts ? (
        <Spinner />
      ) : (
        <BottomSheet
          open={open}
          onClose={onClose}
          title="My accounts"
          clazz="my-accounts-bottom__wrapper"
          type="max-scroll"
        >
          <div className="my-accounts__content">
            <div className="my-accounts__list">
              {(accounts || []).map(account => (
                <div
                  className="my-accounts__item"
                  key={account.name}
                  onClick={() => onSelectAccount(account)}
                >
                  <div className="my-accounts__item__main">
                    <div className="my-accounts__name">{account.dep_ac_alnm_nm}</div>
                    <div className="my-accounts__number">{account.lcl_ac_no_display}</div>
                    <div className="my-accounts__balance">Available Balance ${account.def_ac_blc_display}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BottomSheet>
      )}
    </>
  );
};

MyAccountsBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
};

MyAccountsBottom.defaultProps = {
  open: false,
  onClose: () => {},
  onSelect: () => {},
};

export default MyAccountsBottom;
