import * as Yup from 'yup';

export const verifyIdFormSchema = Yup.object().shape({
  id: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
});
