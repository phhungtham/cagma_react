import * as Yup from 'yup';

export const reissueCardFormSchema = Yup.object().shape({
  cardNumber: Yup.string().length(19).required('Card number must be exactly 16 characters long'),
  isLogin: Yup.boolean(),
  expiryDate: Yup.string()
    .length(5, 'Expired date must be exactly 4 characters long (MM/YY)')
    .required('Required field'),
  email: Yup.string()
    .email('Please check your e-mail address')
    .when('isLogin', {
      is: false,
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired(),
    }),
  dob: Yup.string().when('isLogin', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  postalCode: Yup.string().when('isLogin', {
    is: false,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  isEmailVerified: Yup.boolean()
    .oneOf([true], 'You must verify email first')
    .when('isLogin', {
      is: false,
      then: schema => schema.required(),
      otherwise: schema => schema.notRequired(),
    }),
});
