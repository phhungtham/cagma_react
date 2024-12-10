import { emailFormatRegex } from '@common/constants/regex';
import * as Yup from 'yup';

export const EnterEmailSchema = Yup.object().shape({
  email: Yup.string().required('Required field').matches(emailFormatRegex, 'Please check your email'),
  verificationCode: Yup.string(),
  isEmailVerified: Yup.boolean().oneOf([true], 'You must verify email first').required('Required field'),
});
