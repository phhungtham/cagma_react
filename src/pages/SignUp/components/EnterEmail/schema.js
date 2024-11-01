import * as Yup from 'yup';

export const EnterEmailSchema = Yup.object().shape({
  email: Yup.string().required('Required field').email('Please check your e-mail address'),
  verificationCode: Yup.string(),
  isEmailVerified: Yup.boolean().oneOf([true], 'You must verify email first').required('Required field'),
});
