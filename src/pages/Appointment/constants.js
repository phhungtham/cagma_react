import {
  appointmentDetailLabels,
  appointmentHomeLabels,
  bookAppointmentLabels as labels,
} from '@common/constants/labels';

export const appointmentDetailFields = [
  {
    label: appointmentDetailLabels.confirmNumber,
    value: 'number',
  },
  {
    label: appointmentDetailLabels.method,
    value: 'method',
  },
  {
    label: appointmentDetailLabels.appointmentDate,
    value: 'date',
  },
  {
    label: appointmentDetailLabels.appointmentTime,
    value: 'time',
  },
  {
    label: appointmentDetailLabels.nameOfBranch,
    value: 'branchName',
  },
  {
    label: appointmentDetailLabels.branchAddress,
    value: 'branchAddress',
  },
  {
    label: appointmentDetailLabels.addComments,
    value: 'additionalComments',
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
  COMPLETED_HIDDEN: '4',
  CANCELED: '9',
};

export const AppointmentStatusKeyWithLabel = {
  [AppointmentStatusKey.REQUESTED]: appointmentHomeLabels.requested,
  [AppointmentStatusKey.CONFIRMED]: appointmentHomeLabels.confirmed,
  [AppointmentStatusKey.COMPLETED]: appointmentHomeLabels.completed,
  [AppointmentStatusKey.COMPLETED_HIDDEN]: appointmentHomeLabels.completed,
  [AppointmentStatusKey.CANCELED]: appointmentHomeLabels.canceled,
};

export const labelStatusWithVariant = {
  [AppointmentStatusKey.REQUESTED]: 'blue',
  [AppointmentStatusKey.CANCELED]: 'rose',
  [AppointmentStatusKey.CONFIRMED]: 'gray',
  [AppointmentStatusKey.COMPLETED]: 'green',
  [AppointmentStatusKey.COMPLETED_HIDDEN]: 'green',
};

export const labelStatusWithType = {
  [AppointmentStatusKey.REQUESTED]: 'filled',
  [AppointmentStatusKey.CANCELED]: 'filled',
  [AppointmentStatusKey.CONFIRMED]: 'filled',
  [AppointmentStatusKey.COMPLETED]: 'filled',
  [AppointmentStatusKey.COMPLETED_HIDDEN]: 'filled',
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
