import * as Yup from 'yup';

export const reportLostCardFormSchema = Yup.object().shape({
  accident: Yup.string().required('Required field'),
});
