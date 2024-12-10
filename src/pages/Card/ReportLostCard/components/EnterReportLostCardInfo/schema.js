import { emailFormatRegex } from '@common/constants/regex';
import * as Yup from 'yup';

export const reportLostCardInfoSchema = Yup.object().shape({
  cardNumber: Yup.string().length(19).required('Card number must be exactly 16 characters long'),
  expiryDate: Yup.string()
    .length(5, 'Expired date must be exactly 5 characters long (MM/YY)')
    .required('Required field'),
  accident: Yup.string().required('Required field'),
  email: Yup.string().matches(emailFormatRegex, 'Please check your email').required('Required field'),
  isEmailVerified: Yup.boolean().oneOf([true], 'You must verify email first').required('Required field'),
});
