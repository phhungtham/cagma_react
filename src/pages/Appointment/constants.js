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

export const AppointmentStatusKey = {
  REQUESTED: '1',
  CONFIRMED: '2',
  COMPLETED: '3',
  CANCELED: '9',
};

export const AppointmentStatusKeyWithLabel = {
  [AppointmentStatusKey.REQUESTED]: 'Requested',
  [AppointmentStatusKey.CONFIRMED]: 'Confirmed',
  [AppointmentStatusKey.COMPLETED]: 'Completed',
  [AppointmentStatusKey.CANCELED]: 'Canceled',
};

export const labelStatusWithVariant = {
  [AppointmentStatusKey.REQUESTED]: 'blue',
  [AppointmentStatusKey.CANCELED]: 'rose',
  [AppointmentStatusKey.CONFIRMED]: 'gray',
  [AppointmentStatusKey.COMPLETED]: 'gray',
};

export const labelStatusWithType = {
  [AppointmentStatusKey.REQUESTED]: 'filled',
  [AppointmentStatusKey.CANCELED]: 'filled',
  [AppointmentStatusKey.CONFIRMED]: 'filled',
  [AppointmentStatusKey.COMPLETED]: 'outline',
};

export const BookAppointmentType = {
  IN_PERSON: 'inPerson',
  ZOOM: 'zoom',
};

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
    value: 'phoneNumber',
  },
  {
    label: 'Email',
    value: 'email',
  },
  {
    label: 'Preferred Language',
    value: 'langDisplay',
  },
  {
    label: 'Additional Comments',
    value: 'comment',
  },
];
