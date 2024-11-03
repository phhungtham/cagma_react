import * as Yup from 'yup';

export const createIdFormSchema = Yup.object().shape({
  password: Yup.string().min(8).max(12).required('Required field').matches(/[a-z]/).matches(/[A-Z]/).matches(/\d/),
  e2e: Yup.string(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required('Required field'),
});
