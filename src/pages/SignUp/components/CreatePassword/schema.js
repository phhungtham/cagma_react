import * as Yup from 'yup';

export const createIdFormSchema = Yup.object().shape({
  password: Yup.string().required('Required field'),
  confirmPassword: Yup.string().required('Required field'),
});
