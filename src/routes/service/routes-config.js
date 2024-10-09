import OpenAccount from '@pages/Account/OpenAccount';
import AppNotifications from '@pages/AppNotifications';
import AppointmentHome from '@pages/Appointment/AppointmentHome';
import AppointmentManagement from '@pages/Appointment/AppointmentManagement';
import BookAppointment from '@pages/Appointment/BookAppointment';
import BranchDirectory from '@pages/Appointment/BranchDirectory';
import ActiveCard from '@pages/Card/ActiveCard';
import AddNewCard from '@pages/Card/AddNewCard';
import CardMain from '@pages/Card/CardMain';
import ReissueCard from '@pages/Card/ReissueCard';
import ReportLostCard from '@pages/Card/ReportLostCard';
import ReportReleaseCard from '@pages/Card/ReportReleaseCard';
import CommonTestPage from '@pages/CommonTestPage/CommonTestPage';
import DemoComponent from '@pages/DemoComponent/DemoComponent';
import EAlertsBalance from '@pages/E-Alerts/EAlertsBalance';
import EAlertsManagement from '@pages/E-Alerts/EAlertsManagement';
import Home from '@pages/Home/Home';
import Login from '@pages/Login/Login';
import TransferLimitSetting from '@pages/PersonalSetting/TransferLimitSetting';
import ProductList from '@pages/Product/ProductList';
import ChangeProfile from '@pages/Profile/ChangeProfile';
import SignUp from '@pages/SignUp';
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
    private: false,
  },
  {
    path: routePaths.productList,
    component: ProductList,
    private: false,
  },
  {
    path: routePaths.openAccount,
    component: OpenAccount,
    private: false,
  },
  {
    path: routePaths.notification,
    component: AppNotifications,
    private: false,
  },
  {
    path: routePaths.eAlertsManagement,
    component: EAlertsManagement,
    private: false,
  },
  {
    path: routePaths.eAlertsBalance,
    component: EAlertsBalance,
    private: false,
  },
  {
    path: routePaths.appointment,
    component: AppointmentHome,
    private: false,
  },
  {
    path: routePaths.branchDirectory,
    component: BranchDirectory,
    private: false,
  },
  {
    path: routePaths.appointmentManagement,
    component: AppointmentManagement,
    private: false,
  },
  {
    path: routePaths.bookAppointment,
    component: BookAppointment,
    private: false,
  },
  {
    path: routePaths.cards,
    component: CardMain,
    private: false,
  },
  {
    path: routePaths.addNewCard,
    component: AddNewCard,
    private: false,
  },
  {
    path: routePaths.activeCard,
    component: ActiveCard,
    private: false,
  },
  {
    path: routePaths.reissueCard,
    component: ReissueCard,
    private: false,
  },
  {
    path: routePaths.reportLostCard,
    component: ReportLostCard,
    private: false,
  },
  {
    path: routePaths.releaseCard,
    component: ReportReleaseCard,
    private: false,
  },
  {
    path: routePaths.transferLimitSetting,
    component: TransferLimitSetting,
    private: false,
  },
  {
    path: '/demo',
    component: DemoComponent,
    private: true,
  },
  {
    path: '/react-test-page',
    component: CommonTestPage,
    private: false,
    navigatePath: '/',
  },
  {
    path: routePaths.signUp,
    component: SignUp,
    private: false,
  },
];

export default RoutesConfig;
