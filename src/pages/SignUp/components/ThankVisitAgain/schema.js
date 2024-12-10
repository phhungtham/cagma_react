import { emailFormatRegex } from '@common/constants/regex';
import * as Yup from 'yup';

export const verifyIdFormSchema = Yup.object().shape({
  idType: Yup.string(),
  ide2e: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
  email: Yup.string().matches(emailFormatRegex, 'Please check your email'),
});
