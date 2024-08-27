import * as Yup from 'yup';

export const openAccountSchema = Yup.object().shape({
  lcl_ac_no: Yup.string().required('Required field'),
  amount: Yup.string().required('Required field'),
  dep_ac_usag_d: Yup.string().required('Required field'),
});
