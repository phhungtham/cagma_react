import * as Yup from 'yup';

export const createIdFormSchema = Yup.object().shape({
  id: Yup.string().required('Required field'),
});
