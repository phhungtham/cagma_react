import * as Yup from 'yup';

export const activeCardFormSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  cardNumber: Yup.string().length(16).required('Required field'),
  expiryDate: Yup.string()
    .length(5, 'Expired date must be exactly 5 characters long (MM/YY)')
    .required('Required field'),
});
