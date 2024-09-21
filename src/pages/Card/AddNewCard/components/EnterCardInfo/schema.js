import * as Yup from 'yup';

export const enterCardFormSchema = Yup.object().shape({
  accountNo: Yup.string().required('Required field'),
  streetNumber: Yup.string().required('Required field'),
  streetName: Yup.string().required('Required field'),
  aptNumber: Yup.string().required('Required field'),
  city: Yup.string().required('Required field'),
  province: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
});
