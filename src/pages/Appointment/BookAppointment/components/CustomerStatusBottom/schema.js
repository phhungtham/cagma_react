import * as Yup from 'yup';

export const customerStatusSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  email: Yup.string().email('Please check your e-mail').required('Required field'),
  phoneNumber: Yup.string().nullable().optional(),
  lang: Yup.string().nullable().optional(),
  comment: Yup.string().nullable().optional(),
});
