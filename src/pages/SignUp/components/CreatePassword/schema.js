import * as Yup from 'yup';

export const createIdFormSchema = Yup.object().shape({
  password: Yup.string().required('Required field'),
  passwordDisplay: Yup.string().required('Required field'),
  e2e: Yup.string().required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required('Required field'),
  confirmPasswordDisplay: Yup.string().required('Required field'),
});
