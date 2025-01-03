import * as Yup from 'yup';

export const reissueCardFormSchema = Yup.object().shape({
  cardNumber: Yup.string().length(19).required('Card number must be exactly 16 characters long'),
});
