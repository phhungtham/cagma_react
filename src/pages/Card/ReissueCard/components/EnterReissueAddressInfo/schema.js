import * as Yup from 'yup';

export const reissueCardAddressSchema = Yup.object().shape({
  streetNumber: Yup.string().required('Required field'),
  streetName: Yup.string().required('Required field'),
  aptNumber: Yup.string().required('Required field'),
  city: Yup.string().required('Required field'),
  province: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
});
