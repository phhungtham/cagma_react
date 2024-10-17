import { appointmentHomeLabels, bookAppointmentLabels as labels } from '@common/constants/labels';

export const appointmentDetailFields = [
  {
    label: labels.confirmNumber,
    value: 'number',
  },
  {
    label: labels.method,
    value: 'method',
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
    label: labels.branchName,
    value: 'branchName',
  },
  {
    label: labels.branchAddress,
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
  [AppointmentStatusKey.REQUESTED]: appointmentHomeLabels.requested,
  [AppointmentStatusKey.CONFIRMED]: appointmentHomeLabels.confirmed,
  [AppointmentStatusKey.COMPLETED]: 'Completed', //TODO: Missing completed status
  [AppointmentStatusKey.CANCELED]: appointmentHomeLabels.canceled,
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
    label: labels.english,
    value: 'en',
  },
  {
    label: labels.korean,
    value: 'ko',
  },
];

export const customerStatusFields = [
  {
    label: labels.name,
    value: 'name',
  },
  {
    label: labels.phoneNo,
    value: 'phoneNumber',
  },
  {
    label: labels.email,
    value: 'email',
  },
  {
    label: labels.preferredLang,
    value: 'langDisplay',
  },
  {
    label: labels.addComments,
    value: 'comment',
  },
];
