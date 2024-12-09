import * as Yup from 'yup';

export const newCardFormSchema = Yup.object().shape({
  accountNo: Yup.string().required('Required field'),
  streetNumber: Yup.string().required('Required field'),
  streetName: Yup.string().required('Required field'),
  aptNumber: Yup.string(),
  city: Yup.string().required('Required field'),
  province: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
  areaProvince: Yup.string().required('Required field'),
  applyContactless: Yup.boolean().nullable(),
  contactlessPerTransaction: Yup.string().when('applyContactless', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  totalContactless: Yup.string().when('applyContactless', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  getTransactionNotice: Yup.boolean().nullable(),
  email: Yup.string()
    .email('Please check your email')
    .when('getTransactionNotice', {
      is: true,
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired(),
    }),
});
