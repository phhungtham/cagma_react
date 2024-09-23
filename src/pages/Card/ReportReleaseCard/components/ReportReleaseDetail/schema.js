import * as Yup from 'yup';

export const reportReleaseCardFormSchema = Yup.object().shape({
  accident: Yup.string().required('Required field'),
});
