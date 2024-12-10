import { emailFormatRegex } from '@common/constants/regex';
import * as Yup from 'yup';

export const customerStatusSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  email: Yup.string().matches(emailFormatRegex, 'Please check email').required('Required field'),
  phoneNumber: Yup.string().required('Required field'),
  lang: Yup.string().oneOf(['en', 'ko'], 'Value must be either english or korean').required('Required field'),
  comment: Yup.string().nullable().optional(),
});
