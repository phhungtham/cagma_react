import * as Yup from 'yup';

export const activeCardFormSchema = Yup.object().shape({
  name: Yup.string().required('Required field'),
  cardNumber: Yup.string().required('Required field'),
  expiryDate: Yup.string().required('Required field'),
});
