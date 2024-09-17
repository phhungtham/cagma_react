import apparatusZoomImg from '@assets/images/apparatus_zoom_40.png';

export const appointmentDetailFields = [
  {
    label: 'Confirmation Number',
    value: 'number',
  },
  {
    label: 'Method',
    value: 'method',
  },
  {
    label: 'Appointment Date',
    value: 'date',
  },
  {
    label: 'Appointment Time',
    value: 'time',
  },
  {
    label: 'Name of the Branch',
    value: 'branchName',
  },
  {
    label: 'Branch Address',
    value: 'branchAddress',
  },
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
    value: 'br_telno',
  },
  {
    label: 'Fax',
    value: 'br_fax_no',
  },
  {
    label: 'Branch No',
    value: 'brno',
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
    image: apparatusZoomImg,
  },
  {
    id: '#123456',
    branchName: 'Mississauge Branch',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CONFIRMED,
    image: apparatusZoomImg,
  },
  {
    id: '#123456',
    branchName: 'Mississauge Branch',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CANCELED,
    image: apparatusZoomImg,
  },
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.REQUESTED,
    image: apparatusZoomImg,
  },
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CONFIRMED,
    image: apparatusZoomImg,
  },
  {
    id: '#123456',
    branchName: '',
    date: '2024.06.15',
    time: 'At 1pm',
    status: AppointmentStatus.CONFIRMED,
    image: apparatusZoomImg,
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
  ZOOM: 'zoom',
};

export const customerTypeOptions = [
  {
    label: 'Personal',
    value: '1',
  },
  {
    label: 'Small Business',
    value: '2',
  },
];

export const preferredLanguages = [
  {
    label: 'English',
    value: 'en',
  },
  {
    label: 'Korean',
    value: 'ko',
  },
];

export const customerStatusFields = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Phone no.',
    value: 'phone',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Preferred Language',
    value: 'language',
  },
  {
    label: 'Additional Comments',
    value: 'comment',
  },
];
