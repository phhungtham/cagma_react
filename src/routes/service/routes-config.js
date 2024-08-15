import { lazy } from 'react';
import Home from 'components/Home/Home';
import Login from 'components/Login/Login';
import FAQ from 'components/FAQ';
import AppNotifications from 'components/AppNotifications';
import Board from 'components/Board';
import ExchangeRate from 'components/ExchangeRate';
import Terms from 'components/Terms';
import CommonTestPage from 'components/CommonTestPage/CommonTestPage';
import ManageCardPin from '@components/VisaCard/ManageCardPin';
import Cards from '@components/VisaCard/Cards';
import TransactionHistoryPage from '@components/VisaCard/TransactionHistoryPage';
import TermsAndAgreement from '@components/VisaCard/TermsAndAgreement';
import ActivateCard from '@components/VisaCard/ActivateCard';
import CreateNewCard from '@components/VisaCard/CreateNewCard';
import SelectCards from '@components/VisaCard/SelectCards';
import CreateNewVirtualCards from '@components/VisaCard/CreateNewVirtualCards';
import FraudWarning from '@components/FraudWarning';
import OpenSourceLicense from '@components/OpenSourceLicense';
import SalesAnalysis from '@components/Merchants/SalesAnalysis';
import ChangeProfile from '@components/Profile/ChangeProfile';
import OpenAccount from '@components/Account/OpenAccount';

const RoutesConfig = [
  {
    path: '/',
    component: Home,
    private: false
  },
  {
    path: '/login',
    component: Login,
    private: false
  },
  {
    path: '/change-profile',
    component: ChangeProfile,
    private: true
  },
  {
    path: '/open-account',
    component: OpenAccount,
    private: true
  },
  {
    path: '/exchange-rate',
    component: ExchangeRate,
    private: false,
    navigatePath: '/'
  },
  {
    path: '/notification',
    component: AppNotifications,
    private: false
  },
  {
    path: '/faq',
    component: FAQ,
    private: false,
    navigatePath: '/'
  },
  {
    path: '/board',
    component: Board,
    private: false,
    navigatePath: '/board'
  },
  {
    path: '/terms',
    component: Terms,
    private: false,
    navigatePath: '/'
  },
  {
    path: '/react-test-page',
    component: CommonTestPage,
    private: true,
    navigatePath: '/'
  },
  {
    path: '/cards/manage-card-pin',
    component: ManageCardPin,
    private: false,
    navigatePath: '/cards'
  },
  {
    path: '/cards',
    component: Cards,
    private: false,
    navigatePath: '/'
  },
  {
    path: '/cards/transaction-history',
    component: TransactionHistoryPage,
    private: false,
    navigatePath: '/cards'
  },
  {
    path: 'cards/add-new-card',
    component: TermsAndAgreement,
    private: false,
    navigatePath: '/cards'
  },
  {
    path: '/cards/activate-card',
    private: false,
    component: ActivateCard,
    navigatePath: '/cards'
  },
  {
    path: '/cards/enter-card-info',
    private: false,
    component: CreateNewCard,
    navigatePath: '/cards'
  },
  {
    path: '/cards/new-card-list',
    private: false,
    component: SelectCards,
    navigatePath: '/cards'
  },
  {
    path: '/cards/create-virtual-cards',
    private: false,
    component: CreateNewVirtualCards,
    navigatePath: '/cards'
  },
  {
    path: '/fraud-warning',
    component: FraudWarning,
    private: false,
    navigatePath: '/'
  },
  {
    path: '/open-source-license',
    component: OpenSourceLicense,
    private: false,
    navigatePath: '/'
  },
  {
    path: '/payment/merchant/sales-analysis',
    component: SalesAnalysis,
    private: false,
    navigatePath: '/'
  }
];

// Reference: https://www.codemzy.com/blog/fix-chunkloaderror-react
const lazyRetry = function (componentImport, name) {
  if (!name) name = 'lazy';
  return new Promise((resolve, reject) => {
    // check if the window has already been refreshed
    const hasRefreshed = JSON.parse(window.sessionStorage.getItem(`retry-${name}-refreshed`) || 'false');
    // try to import the component
    componentImport()
      .then(component => {
        window.sessionStorage.setItem(`retry-${name}-refreshed`, 'false'); // success so reset the refresh
        resolve(component);
      })
      .catch(error => {
        if (!hasRefreshed) {
          // not been refreshed yet
          window.sessionStorage.setItem(`retry-${name}-refreshed`, 'true'); // we are now going to refresh
          return window.location.reload(); // refresh the page
        }
        reject(error); // Default error behaviour as already tried refresh
      });
  });
};
export default RoutesConfig;
