import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import InfoBox from '@common/components/atoms/InfoBox';
import EnterAmountBottom from '@common/components/organisms/bottomSheets/EnterAmountBottom';
import MyAccountsBottom from '@common/components/organisms/bottomSheets/MyAccountsBottom';
import SelectDateBottom from '@common/components/organisms/bottomSheets/SelectDateBottom';
import SelectTermsBottom from '@common/components/organisms/bottomSheets/SelectTermsBottom';
import SelectTimeBottom from '@common/components/organisms/bottomSheets/SelectTimeBottom';
import ViewMapBottom from '@common/components/organisms/bottomSheets/ViewMapBottom';
import ViewTermBottom from '@common/components/organisms/bottomSheets/ViewTermBottom';
import Header from '@common/components/organisms/Header';
import { MENU_CODE } from '@common/constants/common';
import { getJobCode, getSubJobCode } from '@common/constants/commonCode';
import { CurrencyCode } from '@common/constants/currency';
import { SelectTermDurationTypes } from '@common/constants/terms';
import useCommonCode from '@hooks/useCommonCode';
import useReducers from '@hooks/useReducers';
import useSagas from '@hooks/useSagas';
import CustomerInfoBottom from '@pages/Account/OpenAccount/components/CustomerInfoBottom';
import { getCustomerInfoRequest } from '@pages/Account/OpenAccount/redux/customer/action';
import { customerReducer } from '@pages/Account/OpenAccount/redux/customer/reducer';
import { customerSaga } from '@pages/Account/OpenAccount/redux/customer/saga';
import { customerInfo } from '@pages/Account/OpenAccount/redux/customer/selector';
import { CustomerFeatureName } from '@pages/Account/OpenAccount/redux/customer/type';
import callCamera from '@utilities/gmCommon/callCamera';
import callSelectImage from '@utilities/gmCommon/callSelectImage';
import initProfileImg from '@utilities/gmCommon/initProfileImg';
import loadProfileImgInfo from '@utilities/gmCommon/loadProfileImgInfo';
import saveProfileImg from '@utilities/gmCommon/saveProfileImg';
import hideSecureKeyboardChar from '@utilities/gmSecure/hideSecureKeyboardChar';
import hideSecureKeyboardNumber from '@utilities/gmSecure/hideSecureKeyboardNumber';
import showSecureKeyboardChar from '@utilities/gmSecure/showSecureKeyboardChar';
import showSecureKeyboardNumber from '@utilities/gmSecure/showSecureKeyboardNumber';
import {
  callPhone,
  clearHistory,
  decryptCVC,
  getLoginInfo,
  hideCertificationNumber,
  moveBack,
  moveHome,
  moveNext,
  showCertificationNumber,
} from '@utilities/index';
import { setAuthenticated } from 'shared/features/auth/action';

import { submitLoginRequest } from '../Login/redux/action';
import { loginReducer } from '../Login/redux/reducer';
import { loginSaga } from '../Login/redux/saga';
import { loginStatusMsg, loginStatusSelector } from '../Login/redux/selector';
import { FeatureLoginName } from '../Login/redux/type';

const CommonTestPage = () => {
  const [showBottomSheet, setShowBottomSheet] = useState({
    bottomAccount: false,
    reportLost: false,
    cardBlock: false,
    releaseBlockCard: false,
    unlockCard: false,
    manageLimit: false,
    decryptCVC: false,
    MyAccountsBottom: false,
    CustomerInfoBottom: false,
    ViewTermBottom: false,
    ViewMapBottom: false,
    SelectDateBottom: false,
    SelectTimeBottom: false,
    SelectTermsBottom: false,
  });

  const defaultAccount = {
    user_id: 'DOOLY94',
    password: 'qwer1234',
  };
  const [accountInfo, setaccountInfo] = useState(defaultAccount);
  const [loginInfo, setLoginInfo] = useState(null);
  const [showCompletedPage, setShowCompletedPage] = useState(false);

  const [cvcText, setCVCText] = useState('aJAQjrapJCfRhy/+k13how==');
  const loginMessage = useSelector(loginStatusMsg);
  const [selectAccount, setSelectedAccount] = useState();
  const [selectAmount, setSelectedAmount] = useState();
  const [selectTerm, setSelectTerm] = useState();

  // select date , time
  const [selectDate, setSelectDate] = useState({
    date: `${new Date().getMonth() + 1}.${new Date().getFullYear()}`,
  });
  const [selectTime, setSelectTime] = useState({
    time: `${new Date().getHours() % 12} ${new Date().getHours() > 12 ? 'PM' : 'AM'}`,
  });
  //Get customer info and phone number of home address, job data
  useReducers([{ key: CustomerFeatureName, reducer: customerReducer }]);
  useSagas([{ key: CustomerFeatureName, saga: customerSaga }]);
  const { sendRequest: requestGetJob, data: jobData } = useCommonCode();
  useEffect(() => {
    if (showBottomSheet.CustomerInfoBottom && !customer) {
      getCustomerInfoRequest();
    }
  }, [showBottomSheet.CustomerInfoBottom]);
  const customer = useSelector(customerInfo);

  const homeAddress = customer?.r_CAME001_1Vo?.find(address => address.cus_adr_t === 11);
  const cus_adr_telno = homeAddress?.cus_adr_telno || '';

  useEffect(() => {
    if (jobData) {
      const jobType = customer.job_t;
      const jobMapList = jobData.job_t || [];
      customer.job_display = jobMapList.find(item => item.key === jobType)?.value || '';
      const subJobType = customer.sub_job_t_v;
      const subJobMapList = jobData.sub_job_t_v || [];
      customer.sub_job_display = subJobMapList.find(item => item.key === subJobType)?.value || '';
    }
  }, [jobData]);
  useEffect(() => {
    if (customer && !jobData) {
      requestGetJob(`${getJobCode};${getSubJobCode}`);
    }
  }, [customer]);
  // Login
  useReducers([{ key: FeatureLoginName, reducer: loginReducer }]);
  useSagas([{ key: FeatureLoginName, saga: loginSaga }]);
  const handleChangeAccountInfo = value => {
    setaccountInfo({ ...accountInfo, ...value });
  };
  const isLoginSuccess = useSelector(loginStatusSelector);
  const navigate = useNavigate();

  const renderNotify = () => {
    if (isLoginSuccess) {
      return (
        <InfoBox
          label={'Login Successfully !!'}
          variant={'informative'}
        />
      );
    } else {
      return (
        <InfoBox
          label={loginMessage}
          variant={'negative'}
        />
      );
    }
  };

  const onSubmitLogin = () => {
    const userInfo = {
      uicc_id: 'x6BcpPoe9rVti6Jy2i/6iNwIe83Qjv4vVixo8MgZ1ds=',
      login_type: '1',
      user_id: accountInfo?.user_id,
      USER_PWD: accountInfo?.password,
      auth_key: '',
      token_id: '512088810006623',
      cusno: '',
    };
    submitLoginRequest(userInfo);
  };

  const handleViewHistory = () => {};

  const handleCallCameraCallback = data => {
    console.log('camera data :>> ', data);
  };

  const handleCallSelectImageCallback = data => {
    console.log('select image data :>> ', data);
  };

  const handleLoadProfileImgInfoCallback = data => {
    console.log('load profile image data :>> ', data);
  };

  const handleSaveProfileImgCallback = data => {
    console.log('save profile image data :>> ', data);
  };

  const handleInitProfileImgCallback = data => {
    console.log('init profile image data :>> ', data);
  };

  const handleShowKeyboardCharCallback = data => {
    console.log('show secure keyboard char data :>> ', data);
  };

  const handleHideKeyboardCharCallback = data => {
    console.log('hide secure keyboard char data :>> ', data);
  };

  const handleShowKeyboardNumberCallback = data => {
    console.log('show secure keyboard number data :>> ', data);
  };

  const handleHideKeyboardNumberCallback = data => {
    console.log('hide secure keyboard number data :>> ', data);
  };

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
        { title: 'Move', label: 'move', action: () => moveNext(MENU_CODE.ACCOUNT) },
      ],
    },
    {
      label: '• ShowSecureKeypad',
      items: [
        {
          title: 'Show Certification Number',
          label: 'show certification',
          action: () =>
            showCertificationNumber({ title: 'Title', description: 'Description', maxLength: 4, errMsg: '' }),
        },
        { title: 'Hide Certification Number', label: 'hide certification', action: () => hideCertificationNumber() },
      ],
    },
    {
      label: '• GMCommon',
      items: [
        {
          title: 'Get LoginInfo',
          label: 'getLoginInfo',
          action: () => getLoginInfo(handleLoginInfo),
        },
        {
          title: 'Call Phone',
          label: 'callPhone',
          action: () => callPhone('0221518419'),
        },
        {
          title: 'Call Camera',
          label: 'callCamera',
          action: () => callCamera(handleCallCameraCallback),
        },
        {
          title: 'Call Select Image',
          label: 'callSelectImage',
          action: () => callSelectImage(handleCallSelectImageCallback),
        },
        {
          title: 'Load Profile Image Info',
          label: 'loadProfileImgInfo',
          action: () => loadProfileImgInfo(handleLoadProfileImgInfoCallback),
        },
        {
          title: 'Save Profile Image',
          label: 'saveProfileImg',
          action: () => saveProfileImg(handleSaveProfileImgCallback),
        },
        {
          title: 'Init Profile Image',
          label: 'initProfileImg',
          action: () => initProfileImg(handleInitProfileImgCallback),
        },
        {
          title: 'Show Secure Keyboard Char',
          label: 'showSecureKeyboardChar',
          action: () => showSecureKeyboardChar(handleShowKeyboardCharCallback),
        },
        {
          title: 'Hide Secure Keyboard Char',
          label: 'hideSecureKeyboardChar',
          action: () => hideSecureKeyboardChar(handleHideKeyboardCharCallback),
        },
        {
          title: 'Show Secure Keyboard Number',
          label: 'showSecureKeyboardNumber',
          action: () => showSecureKeyboardNumber(handleShowKeyboardNumberCallback),
        },
        {
          title: 'Hide Secure Keyboard Number',
          label: 'hideSecureKeyboardNumber',
          action: () => hideSecureKeyboardNumber(handleHideKeyboardNumberCallback),
        },
      ],
    },
    {
      label: '• GMSecure',
      items: [
        {
          title: 'Decrypt CVC',
          label: 'decryptCVC',
          action: () => setShowBottomSheet({ ...showBottomSheet, decryptCVC: true }),
        },
      ],
    },
    {
      label: '• Test BS',
      items: [
        {
          title: 'Customer Info',
          label: 'Customer Info',
          action: () => setShowBottomSheet({ ...showBottomSheet, CustomerInfoBottom: true }),
        },
        {
          title: 'Get Account list',
          label: 'Account List',
          action: () => setShowBottomSheet({ ...showBottomSheet, MyAccountsBottom: true }),
        },
        {
          title: 'Enter Amount',
          label: 'Enter Amount',
          action: () => setShowBottomSheet({ ...showBottomSheet, EnterAmountBottom: true }),
        },

        {
          title: 'View Term',
          label: 'View Term',
          action: () => setShowBottomSheet({ ...showBottomSheet, ViewTermBottom: true }),
        },
        {
          title: 'View Map',
          label: 'View Map',
          action: () => setShowBottomSheet({ ...showBottomSheet, ViewMapBottom: true }),
        },
        {
          title: 'Select Date',
          label: 'Select Date',
          action: () => setShowBottomSheet({ ...showBottomSheet, SelectDateBottom: true }),
        },
        {
          title: 'Select Time',
          label: 'Select Time',
          action: () => setShowBottomSheet({ ...showBottomSheet, SelectTimeBottom: true }),
        },
        {
          title: 'Select Term',
          label: 'Select Term',
          action: () => setShowBottomSheet({ ...showBottomSheet, SelectTermsBottom: true }),
        },
      ],
    },
  ];

  return (
    <>
      <div className="common__test__wrapper">
        {renderNotify()}
        <Header title={'Common Test Page'} />
        <section className="login__field">
          <section className="language__wrapper">
            <span className="title">Language</span>
            <select
              name="language"
              id="language"
            >
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
              <option value="WTLEE815">WTLEE815</option>
              <option value="HANNADIK1">HANNADIK1</option>
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

        {showBottomSheet.CustomerInfoBottom && (
          <CustomerInfoBottom
            customerInfo={{ ...customer, cus_adr_telno }}
            // open={showBottomSheet.CustomerInfoBottom}
            onClose={() => setShowBottomSheet({ ...showBottomSheet, CustomerInfoBottom: false })}
            onClickConfirm={() => alert('Click confirm')}
            onClickChangeProfile={() => alert('Click Change profile')}
          />
        )}
        <MyAccountsBottom
          open={showBottomSheet.MyAccountsBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, MyAccountsBottom: false })}
          onSelect={account => {
            setSelectedAccount();
            setSelectedAccount(account);
            setShowBottomSheet({ ...showBottomSheet, MyAccountsBottom: false });
          }}
        />
        {showBottomSheet.EnterAmountBottom && (
          <EnterAmountBottom
            onClose={() => setShowBottomSheet({ ...showBottomSheet, EnterAmountBottom: false })}
            account={selectAccount}
            currency={CurrencyCode.CAD}
            amount={selectAmount}
            min={100}
            max={99999}
            onChangeAmount={result => {
              setSelectedAmount(result.amount);
              console.log(selectAmount);
            }}
          />
        )}

        <ViewTermBottom
          open={showBottomSheet.ViewTermBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, ViewTermBottom: false })}
          onSelect={() => alert('Selected account')}
        />

        {/* {showBottomSheet.ViewMapBottom && ( */}
        <ViewMapBottom
          open={showBottomSheet.ViewMapBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, ViewMapBottom: false })}
          branchData={{
            title: '72 Centec',
            caption: '72 Nguyen Thi Minh Khai, Vo Thi Sau',
            phone: '039-596-5416',
            fax: '416-250-3460',
            branchNo: '08048',
          }}
        />
        {/* )} */}

        <SelectDateBottom
          open={showBottomSheet.SelectDateBottom}
          maxYear="2040"
          minYear="1980"
          onClose={() => setShowBottomSheet({ ...showBottomSheet, SelectDateBottom: false })}
          onDateChange={date => {
            setSelectDate({ date });
            setShowBottomSheet({ ...showBottomSheet, SelectDateBottom: false });
          }}
          defaultDate={selectDate.date}
          type="MM/YYYY"
        />

        <SelectTimeBottom
          open={showBottomSheet.SelectTimeBottom}
          onClose={() => setShowBottomSheet({ ...showBottomSheet, SelectTimeBottom: false })}
          onTimeChange={time => {
            setSelectTime({ time });
            setShowBottomSheet({ ...showBottomSheet, SelectTimeBottom: false });
          }}
          defaultTime={selectTime.time}
        />

        {showBottomSheet.SelectTermsBottom && (
          <SelectTermsBottom
            onClose={() => setShowBottomSheet({ ...showBottomSheet, SelectTermsBottom: false })}
            type={SelectTermDurationTypes.MONTH}
            onChange={term => {
              setSelectTerm(term);
              console.log(term);
            }}
            value={selectTerm}
            max={60}
            min={1}
          />
        )}

        {testRowData.map(data => renderNavigationEl(data.label, data.items))}
      </div>
    </>
  );
};

export default CommonTestPage;
