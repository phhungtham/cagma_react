import * as Yup from 'yup';

export const bookAppointmentSchema = Yup.object().shape({
  customerType: Yup.string().required('Required field'),
  purpose: Yup.string().required('Required field'),
  date: Yup.string().required('Required field'),
  time: Yup.string().required('Required field'),
  name: Yup.string().required('Required field'),
  email: Yup.string().email('Please check your email').required('Required field'),
  phoneNumber: Yup.string().nullable().optional(),
  lang: Yup.string().nullable().optional(),
  comment: Yup.string().nullable().optional(),
  customerStatusType: Yup.string().nullable().optional(),
  customerTypeDisplay: Yup.string().nullable().optional(),
  purposeDisplay: Yup.string().nullable().optional(),
  dateDisplay: Yup.string().nullable().optional(),
  timeDisplay: Yup.string().nullable().optional(),
  customerStatusTypeDisplay: Yup.string().nullable().optional(),
});
