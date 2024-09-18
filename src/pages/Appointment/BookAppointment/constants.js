export const bookAppointmentSuccessFields = [
  {
    label: 'Method',
    value: 'method',
  },
  {
    label: 'Name of the Branch',
    value: 'branchName',
  },
  {
    label: 'Address',
    value: 'address',
  },
  {
    label: 'Appointment Date',
    value: 'date',
  },
  {
    label: 'Appointment  Time',
    value: 'time',
  },
  {
    label: 'Confirmation number',
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
