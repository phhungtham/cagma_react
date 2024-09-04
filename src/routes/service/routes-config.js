import OpenAccount from '@pages/Account/OpenAccount';
import AppNotifications from '@pages/AppNotifications';
import AppointmentHome from '@pages/Appointment/AppointmentHome';
import AppointmentManagement from '@pages/Appointment/AppointmentManagement';
import BookAppointment from '@pages/Appointment/BookAppointment';
import BranchDirectory from '@pages/Appointment/BranchDirectory';
import DemoComponent from '@pages/DemoComponent/DemoComponent';
import EAlertsBalance from '@pages/E-Alerts/EAlertsBalance';
import EAlertsManagement from '@pages/E-Alerts/EAlertsManagement';
import Home from '@pages/Home/Home';
import Login from '@pages/Login/Login';
import ProductList from '@pages/Product/ProductList';
import ChangeProfile from '@pages/Profile/ChangeProfile';
import { routePaths } from '@routes/paths';

const RoutesConfig = [
  {
    path: '/',
    component: Home,
    private: false,
  },
  {
    path: '/login',
    component: Login,
    private: false,
  },
  {
    path: '/change-profile',
    component: ChangeProfile,
    private: true,
  },
  {
    path: routePaths.productList,
    component: ProductList,
    private: true,
  },
  {
    path: routePaths.openAccount,
    component: OpenAccount,
    private: true,
  },
  {
    path: '/notification',
    component: AppNotifications,
    private: false,
  },
  {
    path: '/e-alerts-management',
    component: EAlertsManagement,
    private: false,
  },
  {
    path: '/e-alerts-balance',
    component: EAlertsBalance,
    private: false,
  },
  {
    path: '/appointment',
    component: AppointmentHome,
    private: false,
  },
  {
    path: '/branch-directory',
    component: BranchDirectory,
    private: false,
  },
  {
    path: '/appointment-management',
    component: AppointmentManagement,
    private: false,
  },
  {
    path: '/book-appointment',
    component: BookAppointment,
    private: false,
  },
  {
    path: '/demo',
    component: DemoComponent,
    private: false,
  },
];

// Reference: https://www.codemzy.com/blog/fix-chunkloaderror-react
// eslint-disable-next-line no-unused-vars
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
