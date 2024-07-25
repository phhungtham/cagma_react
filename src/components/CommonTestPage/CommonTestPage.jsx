import Header from '@common/ui/components/Header';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { setAuthenticated } from 'shared/features/auth/action';
import { submitLoginRequest } from '../Login/redux/action';
import { loginReducer } from '../Login/redux/reducer';
import { loginSaga } from '../Login/redux/saga';
import { loginStatusMsg, loginStatusSelector } from '../Login/redux/selector';
import { ActionType, FeatureLoginName } from '../Login/redux/type';
import { Button } from '@common/ui/components/atomic/ButtonGroup/Button/Button';
import InfoBox from '@common/ui/components/atomic/InfoBox';
import { MENU_CODE } from '@configs/global/constants';
import {
  callPhone,
  clearHistory,
  getLoginInfo,
  hideCertificationNumber,
  moveBack,
  moveHome,
  moveNext,
  showCertificationNumber,
  decryptCVC
} from '@utilities/index';
import { useNavigate } from 'react-router-dom';
import AccountBottomSheet from '@common/bottomsheets/AccountBottomSheet';
import DebitCardComplete from '@components/VisaCard/components/DebitCardComplete';
import lock__card from '../../assets/images/lock-card.png';
import DebitCardManageLimitBottom from '@common/bottomsheets/ManageLimitBottomSheet';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import Input from '@common/ui/components/atomic/Input/Input';
import DebitCardBottom from '@common/bottomsheets/DebitCardBottom.jsx.jsx';

const CommonTestPage = () => {
  const defaultAccount = {
    user_id: 'DOOLY94',
    password: 'qwer1234'
  };
  const [accountInfo, setaccountInfo] = useState(defaultAccount);
  const [loginInfo, setLoginInfo] = useState(null);
  const [showBottomSheet, setShowBottomSheet] = useState({
    bottomAccount: false,
    reportLost: false,
    cardBlock: false,
    releaseBlockCard: false,
    unlockCard: false,
    manageLimit: false,
    decryptCVC: false
  });
  const [showCompletedPage, setShowCompletedPage] = useState(false);
  const [cvcText, setCVCText] = useState('aJAQjrapJCfRhy/+k13how==');
  const loginMessage = useSelector(loginStatusMsg);

  useReducers([{ key: FeatureLoginName, reducer: loginReducer }]);
  useSagas([{ key: FeatureLoginName, saga: loginSaga }]);
  const handleChangeAccountInfo = value => {
    setaccountInfo({ ...accountInfo, ...value });
  };
  const isLoginSuccess = useSelector(loginStatusSelector);
  const navigate = useNavigate();

  const renderNotify = () => {
    if (isLoginSuccess) {
      return <InfoBox label={'Login Successfully !!'} variant={'informative'} />;
    } else {
      return <InfoBox label={loginMessage} variant={'negative'} />;
    }
  };

  const onSubmitLogin = () => {
    const userInfo = {
      uicc_id: 'LI5D+DstmWVPI6/WtlGr5grpywLN68+swhQMf33CC+o=',
      login_type: '1',
      user_id: accountInfo?.user_id,
      USER_PWD: accountInfo?.password,
      auth_key: '',
      token_id: 'dfewtsfsfssf',
      cusno: ''
    };
    submitLoginRequest(userInfo);
  };

  const handleViewHistory = () => {};

  const handleBackToHome = () => {
    moveBack();
  };

  const handleLoginInfo = result => {
    alert(JSON.stringify(result));
    setLoginInfo(result);
  };

  const handleDecryptCVC = () => {
    decryptCVC(cvcText, decryptCVCCallback);
  };

  const decryptCVCCallback = result => {
    alert(JSON.stringify(result));
  };

  const renderNavigationEl = (sectionLabel, items) => {
    return (
      <section className="navigation__plugin">
        <p>{sectionLabel}</p>
        <ul className="table__cus">
          {items.map(item => {
            const { title, label, action } = item;
            return (
              <li>
                <section className="title">{title}</section>
                <section className="content">
                  <button onClick={() => action()}> {label}</button>
                </section>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  useEffect(() => {
    if (isLoginSuccess) {
      setAuthenticated();
    }
  }, [isLoginSuccess]);

  const testRowData = [
    {
      label: '• NavigationPlugin',
      items: [
        { title: 'Move', label: 'move', action: () => moveNext(MENU_CODE.ACCOUNT) },
        { title: 'Back', label: 'back', action: () => moveBack() },
        { title: 'Clear History', label: 'clear history', action: () => clearHistory(MENU_CODE.ACCOUNT) },
        { title: 'Home', label: 'home', action: () => moveHome() },
        { title: 'Move', label: 'move', action: () => moveNext(MENU_CODE.ACCOUNT) }
      ]
    },
    {
      label: '• ShowSecureKeypad',
      items: [
        {
          title: 'Show Certification Number',
          label: 'show certification',
          action: () =>
            showCertificationNumber({ title: 'Title', description: 'Description', maxLength: 4, errMsg: '' })
        },
        { title: 'Hide Certification Number', label: 'hide certification', action: () => hideCertificationNumber() }
      ]
    },
    {
      label: '• GMCommon',
      items: [
        {
          title: 'Get LoginInfo',
          label: 'getLoginInfo',
          action: () => getLoginInfo(handleLoginInfo)
        },
        {
          title: 'Call Phone',
          label: 'callPhone',
          action: () => callPhone('0221518419')
        }
      ]
    },
    {
      label: '• GMSecure',
      items: [
        {
          title: 'Decrypt CVC',
          label: 'decryptCVC',
          action: () => setShowBottomSheet({ ...showBottomSheet, decryptCVC: true })
        }
      ]
    },
    {
      label: '• Debit Card UI Page',
      items: [
        {
          title: 'Manage Card Pin',
          label: 'navigate',
          action: () => navigate('/manage-card-pin')
        },
        {
          title: 'Debit card completed screen',
          label: 'show',
          action: () => setShowCompletedPage(true)
        },
        {
          title: 'Transaction History',
          label: 'navigate',
          action: () => navigate('/transaction-history')
        },
        {
          title: 'Add new Card (Terms and Agreenment)',
          label: 'navigate',
          action: () => navigate('/terms-agreement')
        },
        {
          title: 'Active Card',
          label: 'navigate',
          action: () => navigate('/cards/activate-card')
        }
      ]
    },
    {
      label: '• Debit Card Bottom Sheet',
      items: [
        {
          title: 'Bottom sheet account',
          label: 'show',
          action: () => setShowBottomSheet({ ...showBottomSheet, bottomAccount: true })
        },
        {
          title: 'Bottom Sheet Report Lost',
          label: 'report lost',
          action: () => setShowBottomSheet({ ...showBottomSheet, reportLost: true })
        },
        {
          title: 'Bottom Sheet Card Block',
          label: 'card block',
          action: () => setShowBottomSheet({ ...showBottomSheet, cardBlock: true })
        },
        {
          title: 'Bottom Sheet Unlock',
          label: 'unlock',
          action: () => setShowBottomSheet({ ...showBottomSheet, unlockCard: true })
        },
        {
          title: 'Bottom Sheet Manage Limit',
          label: 'manage limit',
          action: () => setShowBottomSheet({ ...showBottomSheet, manageLimit: true })
        }
      ]
    }
  ];

  return (
    <>
      <div className="common__test__wrapper">
        {renderNotify()}
        <Header title={'Common Test Page'} />
        <section className="login__field">
          <section className="language__wrapper">
            <span className="title">Language</span>
            <select name="language" id="language">
              <option value="eng">English</option>
              <option value="ko">Korea</option>
            </select>
          </section>
          <section className="account__wrapper">
            <span className="title">Account</span>
            <select
              name="user__id"
              id="account"
              defaultValue={defaultAccount.user_id}
              onChange={e => handleChangeAccountInfo({ user_id: e.target.value })}
            >
              <option value="DOOLY94">DOOLY94</option>
              <option value="YOUNGDOL1">YOUNGDOL1</option>
            </select>
            <input
              onChange={e => handleChangeAccountInfo({ password: e.target.value })}
              name="password"
              defaultValue={defaultAccount.password}
            />
          </section>
          <section className="button__wrapper">
            <button onClick={onSubmitLogin}>login</button>
            <button>logout</button>
          </section>
        </section>
        {testRowData.map(data => renderNavigationEl(data.label, data.items))}
        <AccountBottomSheet
          open={showBottomSheet.bottomAccount}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, bottomAccount: false })}
        />
        <BottomSheet
          open={showBottomSheet.decryptCVC}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, decryptCVC: false })}
          title="decrypt CVC"
        >
          <Input
            label={'CVC'}
            defaultValue={'aJAQjrapJCfRhy/+k13how=='}
            onChange={e => setCVCText(e.target.value)}
          ></Input>
          <Button variant={'solid'} label={'decrypt'} disable={false} onClick={handleDecryptCVC} />
        </BottomSheet>
      </div>
      {/* bottom sheet for debit card screen.... */}
      <DebitCardBottom
        open={showBottomSheet.reportLost}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, reportLost: false })}
        cardName="Visa Debit card"
        debitBottomType="report"
        accountLinked={{
          type: 'Main account',
          number: '123 244 566'
        }}
        onBottomSheetButtonClick={type => alert(type)}
      />
      <DebitCardBottom
        open={showBottomSheet.cardBlock}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, cardBlock: false })}
        cardName="Visa Virtual card"
        debitBottomType="lock"
        accountLinked={{
          type: 'Main account',
          number: '123 244 566'
        }}
        onBottomSheetButtonClick={type => alert(type)}
      />
      <DebitCardBottom
        open={showBottomSheet.releaseBlockCard}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, releaseBlockCard: false })}
        cardName="Visa Debit card"
        debitBottomType="release"
        accountLinked={{
          type: 'Main account',
          number: '123 244 566'
        }}
        onBottomSheetButtonClick={type => alert(type)}
      />
      <DebitCardBottom
        open={showBottomSheet.unlockCard}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, unlockCard: false })}
        cardName="Visa Virtual card"
        debitBottomType="unlock"
        accountLinked={{
          type: 'Main account',
          number: '123 244 566'
        }}
        onBottomSheetButtonClick={type => alert(type)}
      />
      <DebitCardManageLimitBottom
        open={showBottomSheet.manageLimit}
        onClose={() => setShowBottomSheet({ ...showBottomSheet, manageLimit: false })}
      />
      {/* completed page */}
      {showCompletedPage && (
        <DebitCardComplete
          dateComplete="20.12.2022 15:50:58"
          cardName="Visa Debit Card"
          actionText={{
            text: 'has been locked',
            position: 'right'
          }}
          completeThumbnail={lock__card}
          dataTable={[
            {
              title: 'Card name',
              value: ['VISA Debit card']
            },
            {
              title: 'Link to',
              value: ['Main account', '123-456-7891012']
            }
          ]}
          duoButton={{
            firstButton: {
              label: 'View History',
              action: handleViewHistory
            },
            secondButton: {
              label: 'Home',
              action: handleBackToHome
            }
          }}
        />
      )}
    </>
  );
};

export default CommonTestPage;
