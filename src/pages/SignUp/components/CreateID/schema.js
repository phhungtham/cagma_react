import * as Yup from 'yup';

export const createIdFormSchema = Yup.object().shape({
  id: Yup.string().min(6).max(20).required('Required field'),
});
