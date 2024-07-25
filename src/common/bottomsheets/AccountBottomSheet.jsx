import Alert from '@common/ui/components/atomic/Alert/Alert';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import List from '@common/ui/components/atomic/ListGroup/List';
import Span from '@common/ui/components/atomic/Span';
import { getAccountResquest } from '@components/Account/redux/action';
import { accountReducer } from '@components/Account/redux/reducer';
import { accountSaga } from '@components/Account/redux/saga';
import {
  getAccountFailedMsg,
  listAccount,
  listAccountChecking,
  listAccountLoan,
  listAccountSaving
} from '@components/Account/redux/selector';
import { FeatureName } from '@components/Account/redux/type';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { authActivationAccountPassword } from '@utilities/index';
import isEmpty from '@utilities/isEmpty';
import { ArrowDown, ArrowUp, CheckingIcon, LoanIcon, SavingIcon } from 'assets/icons';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const AccountBottomSheet = props => {
  useReducers([{ key: FeatureName, reducer: accountReducer }]);
  useSagas([{ key: FeatureName, saga: accountSaga }]);

  const { open, onClose, isHideBalance = true, setAccount, translate } = props;

  const [showHiddenAccount, setShowHiddenAccount] = useState(false);
  const [queryAccountError, setQueryAccountError] = useState(false);
  const accounts = useSelector(listAccount);
  const getAccountStatus = useSelector(getAccountFailedMsg);
  const accountsChecking = useSelector(listAccountChecking) || [];
  const accountsSaving = useSelector(listAccountSaving) || [];
  const accountsLoan = useSelector(listAccountLoan) || [];
  const allAccounts = [...accountsChecking, ...accountsSaving, ...accountsLoan];

  const checkAccountStatus = type => {
    if (!type) return;
    return accountsChecking.filter(account => {
      return account.is_hidden_account === type.toString();
    });
  };
  const visibleAccounts = checkAccountStatus(9);
  const hiddenAccounts = checkAccountStatus(1);

  useEffect(() => {
    setShowHiddenAccount(false);
  }, [open]);

  // for test....
  useEffect(() => {
    if (getAccountStatus === undefined) return;
    open && setQueryAccountError(true);
  }, [getAccountStatus, open]);

  useEffect(() => {
    const inquiryType = {
      inquiry_type: 1
    };
    if ((!accounts || isEmpty(accounts)) && open) {
      getAccountResquest(inquiryType);
    }
  }, [accounts, open]);

  const renderIcons = accountType => {
    switch (accountType) {
      case '01':
        return <CheckingIcon />;
      case '02':
        return <SavingIcon />;
      default:
        return <LoanIcon />;
    }
  };

  const handleShowHiddenAccount = () => {
    if (!showHiddenAccount) {
      authActivationAccountPassword(handleAuthSuccess);
    } else {
      setShowHiddenAccount(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowHiddenAccount(true);
  };

  return (
    <>
      <BottomSheet
        clazz={`account__bottom ${accounts && 'has__data'}`}
        title="My Accounts"
        open={open}
        onClose={onClose}
      >
        <section className="account__bottom__list">
          {visibleAccounts?.map((account, index) => (
            <List
              key={index + account.acno}
              clazz="account__bottom__item"
              title={account.ac_nm}
              subTitle={`${account.acno_display} ${isHideBalance ? '|' + account.ac_ccy_c : ''}`}
              captionSegments={{
                caption1:
                  !isHideBalance && `${translate('lbl_BIQ3000000_0014')} ${account.ac_blc_display} ${account.ac_ccy_c} `
              }}
              thumbnail={renderIcons(account.ac_k_cd)}
              onListClick={() => {
                setAccount(account);
              }}
            />
          ))}
        </section>

        {accounts && (
          <section className={`account__hidden ${showHiddenAccount && 'show'}`}>
            <Span clazz="account__hidden__title" text={translate('lbl_BIQ3000000_0008')} />
            <div className="account__hidden__arrow" onClick={handleShowHiddenAccount}>
              {showHiddenAccount ? <ArrowUp /> : <ArrowDown />}
            </div>
          </section>
        )}

        {showHiddenAccount &&
          hiddenAccounts?.map((accHidden, index) => (
            <List
              key={index}
              clazz="account__bottom__item hidden"
              title={accHidden.ac_nm}
              subTitle={`${accHidden.acno_display} ${isHideBalance ? '|' + accHidden.ac_ccy_c : ''}`}
              captionSegments={{
                caption1:
                  !isHideBalance &&
                  `${translate('lbl_BIQ3000000_0014')} ${accHidden.ac_blc_display} ${accHidden.ac_ccy_c} `
              }}
              thumbnail={renderIcons(accHidden.ac_k_cd)}
            />
          ))}
      </BottomSheet>
      {/* alert error */}
      <Alert
        isCloseButton={false}
        isShowAlert={queryAccountError}
        subtitle={getAccountStatus?.msgText || ''}
        alertType={getAccountStatus?.msgType || ''}
        firstButton={{
          onClick: () => {
            setQueryAccountError(false);
          },
          label: translate('lbl_cta_3006')
        }}
      />
    </>
  );
};

export default withHTMLParseI18n(AccountBottomSheet);
