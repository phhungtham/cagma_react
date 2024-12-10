import { emailFormatRegex } from '@common/constants/regex';
import * as Yup from 'yup';

export const activeCardEnterAccountSchema = Yup.object().shape({
  phoneNumber: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
  postalCode: Yup.string().length(6, 'Postal code must be exactly 6 digits').required('Required field'),
  lastSixAccountNumber: Yup.string().length(6, 'Field must be exactly 6 digits').required('Required field'),
  email: Yup.string().matches(emailFormatRegex, 'Please check your email').required('Required field'),
  isAgree: Yup.boolean().oneOf([true], 'You must accept the terms and conditions').required('Required field'),
});
