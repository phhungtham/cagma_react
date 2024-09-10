import * as Yup from 'yup';

export const changeProfileSchema = Yup.object().shape({
  email: Yup.string().email('Please check Your E-mail'),
});
