import * as Yup from 'yup';

export const EnterUserIdSchema = Yup.object().shape({
  userId: Yup.string().required('Required field'),
});
