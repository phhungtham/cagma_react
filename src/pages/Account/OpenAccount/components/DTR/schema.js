import * as Yup from 'yup';

export const dtrFormSchema = Yup.object().shape({
  sin: Yup.string().required('Required field'),
  isUSResident: Yup.string().oneOf(['Y', 'N'], 'Value must be Yes or No').required('Required field'),
  personalTin: Yup.string().when('isUSResident', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  isOtherCountryResident: Yup.string().oneOf(['Y', 'N'], 'Value must be Yes or No').required('Required field'),
  country1: Yup.string().when('isOtherCountryResident', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  tin1: Yup.string().when(['notHaveTin1', 'isOtherCountryResident'], {
    is: (notHaveTin1, isOtherCountryResident) => isOtherCountryResident === 'Y' && !notHaveTin1,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  reason1: Yup.string().when(['notHaveTin1', 'isOtherCountryResident'], {
    is: (notHaveTin1, isOtherCountryResident) => isOtherCountryResident === 'Y' && notHaveTin1,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  countries: Yup.array().of(
    Yup.object().shape({
      country: Yup.string().required('Required field'),
      notHaveTin: Yup.boolean().required('Required field'),
      countryTin: Yup.string().when('notHaveTin', {
        is: false,
        then: schema => schema.required(),
        otherwise: schema => schema.notRequired(),
      }),
      reason: Yup.boolean()
        .required('Required field')
        .when('notHaveTin', {
          is: true,
          then: schema => schema.required(),
          otherwise: schema => schema.notRequired(),
        }),
    })
  ),
});
