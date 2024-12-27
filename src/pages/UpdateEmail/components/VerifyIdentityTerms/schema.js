import * as Yup from 'yup';

import { VerifyIdentityType } from './constants';

export const VerifyIdentityTermsSchema = Yup.object().shape({
  type: Yup.string().required('Required field'),
  firstName: Yup.string().when('type', {
    is: VerifyIdentityType.AVAILABLE,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  lastName: Yup.string().when('type', {
    is: VerifyIdentityType.AVAILABLE,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  agreeTerms: Yup.boolean().when('type', {
    is: VerifyIdentityType.AVAILABLE,
    then: schema => schema.required().oneOf([true], 'You must agree terms'),
    otherwise: schema => schema.notRequired(),
  }),
});
