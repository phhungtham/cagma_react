import * as Yup from 'yup';

export const verifyIdFormSchema = Yup.object().shape({
  idType: Yup.string(),
  id: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
  email: Yup.string().email().required('Required field'),
});
