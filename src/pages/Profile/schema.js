import { employmentValuesDisableOccupation } from '@common/constants/account';
import * as Yup from 'yup';

export const changeProfileSchema = Yup.object().shape({
  email: Yup.string().required('Required field').email('Please check your e-mail address'),
  isEmailVerified: Yup.bool(),
  callNumber: Yup.string().required('Required field'),
  employment: Yup.string().required('Required field'),
  occupation1: Yup.string().when('employment', {
    is: employment => !employmentValuesDisableOccupation.includes(employment),
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation2: Yup.string().when('employment', {
    is: employment => !employmentValuesDisableOccupation.includes(employment),
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation3: Yup.string().required('Required field'),
  addressType: Yup.string().required('Required field'),
  phoneNumber: Yup.string(),
  faxNumber: Yup.string(),
  country: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
  streetNumber: Yup.string().when('country', {
    is: 'CA',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  streetName: Yup.string().when('country', {
    is: 'CA',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  city: Yup.string().when('country', {
    is: 'CA',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  province: Yup.string().when('country', {
    is: 'CA',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  address1: Yup.string().when('country', {
    is: employment => employment !== 'CA',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  telno_nat_c: Yup.string(),
});
