import * as Yup from 'yup';

export const reportLostCardCustomerInfoSchema = Yup.object().shape({
  email: Yup.string().email('Please check your email').required('Required field'),
});
