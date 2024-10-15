import { CustomerTypes } from '@common/constants/account';
import * as Yup from 'yup';

export const reportLostCardCustomerInfoSchema = Yup.object().shape({
  accident: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
  phoneNumber: Yup.string().required('Required field'),
  email: Yup.string().email('Please check your email').required('Required field'),
  isEmailVerified: Yup.boolean().oneOf([true], 'You must verify email first').required('Required field'),
  customerType: Yup.string().required('Required field'),
  firstName: Yup.string().when('customerType', {
    is: CustomerTypes.PERSONAL,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  lastName: Yup.string().when('customerType', {
    is: CustomerTypes.PERSONAL,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  dob: Yup.string().when('customerType', {
    is: CustomerTypes.PERSONAL,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  companyAcNo: Yup.string().when('customerType', {
    is: CustomerTypes.BUSINESS,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
});
