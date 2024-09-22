import * as Yup from 'yup';

export const reportLostCardInfoSchema = Yup.object().shape({
  cardNumber: Yup.string().required('Required field'),
  email: Yup.string().email('Please check your email').required('Required field'),
  expiryDate: Yup.string()
    .length(5, 'Expired date must be exactly 5 characters long (MM/YY)')
    .required('Required field'), //TODO: Validate 01 <= MM <= 12 and 01 <= YY <= 99
  accident: Yup.string().required('Required field'),
});
