import apparatusZoomImg from '@assets/images/apparatus_zoom_40.png';
export const appointmentDetailFields = [
  {
    label: 'Confirmation Number',
    value: 'number'
  },
  {
    label: 'Method',
    value: 'method'
  },
  {
    label: 'Appointment Date',
    value: 'date'
  },
  {
    label: 'Appointment Time',
    value: 'time'
  },
  {
    label: 'Name of the Branch',
    value: 'branchName'
  },
  {
    label: 'Branch Address',
    value: 'branchAddress'
  }
];

export const appointmentDetailTest = {
  number: '#123456',
  method: 'Zoom',
  date: '2024.06.20',
  time: '1:00 PM',
  branchName: 'Mississauga Branch',
  branchAddress: '257 Dundas Street East Unit 3 & 4 Mississauga Ontario L5A 1W8',
};

export const branchFields = [
  {
    label: 'Phone',
    value: 'phone'
  },
  {
    label: 'Fax',
    value: 'fax'
  },
  {
    label: 'Branch No',
    value: 'branchNo'
  },
];

export const branchDirectoryListTest = [
  {
    title: 'North Yrok Ontario Branch',
    caption: '5095 Yonge Street Unit B2 North York Ontario M2N 6Z4',
    phone: '416-250-3550',
    fax: '416-250-3460',
    branchNo: '08048',
  },
  {
    title: 'Mississauga Ontario Branch',
    caption: '257 Dundas Street East Unit 3 & 4 Mississauga Ontario L5A 1W8',
    phone: '416-250-3550',
    fax: '416-250-3460',
    branchNo: '08048',
  },
  {
    title: 'Coquitlam Branch',
    caption: '2929 Barnet Highway Unit 2842 Coquitlam British Columbia V3B 5R5',
    phone: '416-250-3550',
    fax: '416-250-3460',
    branchNo: '08048',
  },
  {
    title: 'North York Ontario Branch',
    caption: '5140 Yonge Street Suite 2300 North York Ontario M2N 6L7',
    phone: '416-250-3550',
    fax: '416-250-3460',
    branchNo: '08048',
  },
];

export const AppointmentStatus = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  CANCELED: 'canceled',
  COMPLETED: 'completed',
};

export const appointmentListTest = [
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.REQUESTED,
    image: apparatusZoomImg
  },
  {
    id: '#123456',
    branchName: 'Mississauge Branch',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CONFIRMED,
    image: apparatusZoomImg
  },
  {
    id: '#123456',
    branchName: 'Mississauge Branch',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CANCELED,
    image: apparatusZoomImg
  },
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.REQUESTED,
    image: apparatusZoomImg
  },
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CONFIRMED,
    image: apparatusZoomImg
  },
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CONFIRMED,
    image: apparatusZoomImg
  },
];

export const labelStatusWithVariant = {
  [AppointmentStatus.REQUESTED]: 'blue',
  [AppointmentStatus.CANCELED]: 'rose',
  [AppointmentStatus.CONFIRMED]: 'gray',
  [AppointmentStatus.COMPLETED]: 'gray',
};

export const labelStatusWithType = {
  [AppointmentStatus.REQUESTED]: 'filled',
  [AppointmentStatus.CANCELED]: 'filled',
  [AppointmentStatus.CONFIRMED]: 'filled',
  [AppointmentStatus.COMPLETED]: 'outline',
};

export const BookAppointmentType = {
  IN_PERSON: 'inPerson',
  ZOOM: 'zoom'
};

export const customerTypeOptions = [
  {
    label: 'Personal Customer',
    value: '1'
  },
  {
    label: 'Small Business Customer',
    value: '2'
  },
];

export const purposeAppointmentOptions = [
  {
    label: 'Open an account',
    value: '1'
  },
  {
    label: 'Banking transaction',
    value: '2'
  },
  {
    label: 'Debit card',
    value: '3'
  },
  {
    label: 'Investing',
    value: '4'
  },
  {
    label: 'Borrowing',
    value: '5'
  },
  {
    label: 'Other',
    value: 'other'
  },
];

export const preferredLanguages = [
  {
    label: 'English',
    value: 'en'
  },
  {
    label: 'Korean',
    value: 'ko'
  }
];

export const customerStatusFields = [
  {
    label: 'Name',
    value: 'name'
  },
  {
    label: 'Phone no.',
    value: 'phone'
  },
  {
    label: 'Email',
    value: 'email'
  },
  {
    label: 'Preferred Language',
    value: 'language'
  },
  {
    label: 'Additional Comments',
    value: 'comment'
  },
];