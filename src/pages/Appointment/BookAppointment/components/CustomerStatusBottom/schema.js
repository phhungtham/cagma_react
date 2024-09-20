import * as Yup from 'yup';

export const customerStatusSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  email: Yup.string().email('Please check your e-mail').required('Required field'),
  phoneNumber: Yup.string().required('Required field'),
  lang: Yup.string().oneOf(['en', 'ko'], 'Value must be either english or korean').required('Required field'),
  comment: Yup.string().nullable().optional(),
});
