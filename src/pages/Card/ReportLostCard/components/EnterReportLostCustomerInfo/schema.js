import * as Yup from 'yup';

export const reportLostCardCustomerInfoSchema = Yup.object().shape({
  accident: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
  phoneNumber: Yup.string().required('Required field'),
  email: Yup.string().email('Please check your email').required('Required field'),
  isEmailVerified: Yup.boolean().oneOf([true], 'You must verify email first').required('Required field'),
  firstName: Yup.string().required('Required field'),
  lastName: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
});
