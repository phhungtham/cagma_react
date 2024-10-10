import * as Yup from 'yup';

export const activeCardFormSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  cardNumber: Yup.string().length(19).required('Card number must be exactly 16 characters long'),
  expiryDate: Yup.string()
    .length(5, 'Expired date must be exactly 4 characters long (MM/YY)')
    .required('Required field'),
});
