import { CustomerTypes } from '@common/constants/account';
import { bookAppointmentLabels as labels } from '@common/constants/labels';

export const bookAppointmentSuccessFields = [
  {
    label: labels.method,
    value: 'method',
  },
  {
    label: labels.branchName,
    value: 'branchName',
  },
  {
    label: labels.address,
    value: 'address',
  },
  {
    label: labels.appointmentDate,
    value: 'date',
  },
  {
    label: labels.appointmentTime,
    value: 'time',
  },
  {
    label: labels.confirmNumber,
    value: 'confirmNumber',
  },
];

export const bookAppointmentFormDefaultValues = {
  customerType: '',
  customerTypeDisplay: '',
  purpose: '',
  purposeDisplay: '',
  date: '',
  dateDisplay: '',
  time: '',
  timeDisplay: '',
  customerStatusType: '',
  customerStatusTypeDisplay: '',
  name: '',
  phoneNumber: '',
  email: '',
  lang: 'en',
  comment: '',
};

export const CustomerStatusType = {
  NEW: 'new',
  EXISTING: 'existing',
};

export const bookAppointmentFormMapFields = {
  customerType: 'apint_user_gbn',
  purpose: 'apint_purp',
  subPurpose: 'apint_sub_purp',
  date: 'apint_reg_dt',
  time: 'apint_reg_tm',
  customerStatusType: 'apint_guest_chk',
  name: 'apint_user_nm',
  email: 'apint_user_email',
  phoneNumber: 'apint_user_telno',
  lang: 'apint_lang_gbn',
  comment: 'apint_memo',
};

export const customerTypeOptions = [
  {
    label: labels.personal,
    value: CustomerTypes.PERSONAL,
  },
  {
    label: labels.smallBusiness,
    value: CustomerTypes.BUSINESS,
  },
];

export const personalPurposeKeys = ['10', '20', '30'];
export const businessPurposeKeys = ['40', '50'];

export const appointmentHourOptions = ['10', '11', '12', '13', '14', '15', '16'];
