import * as Yup from 'yup';

export const verifyUserInfoFormSchema = Yup.object().shape({
  firstName: Yup.string().required('Required field'),
  lastName: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
  province: Yup.string().required('Required field'),
});
