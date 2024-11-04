import * as Yup from 'yup';

export const dtrFormSchema = Yup.object().shape({
  sin: Yup.string().min(9).required('Required field'),
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
  notHaveTin1: Yup.boolean(),
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
  showCountry2: Yup.boolean(),
  country2: Yup.string().when('showCountry2', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  notHaveTin2: Yup.boolean(),
  tin2: Yup.string().when(['notHaveTin2', 'showCountry2'], {
    is: (notHaveTin2, showCountry2) => showCountry2 && !notHaveTin2,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  reason2: Yup.string().when(['notHaveTin2', 'showCountry2'], {
    is: (notHaveTin2, showCountry2) => showCountry2 && notHaveTin2,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  //We just have the other one country
  // countries: Yup.array().of(
  //   Yup.object().shape({
  //     country: Yup.string().required('Required field'),
  //     notHaveTin: Yup.boolean().required('Required field'),
  //     countryTin: Yup.string().when('notHaveTin', {
  //       is: false,
  //       then: schema => schema.required(),
  //       otherwise: schema => schema.notRequired(),
  //     }),
  //     reason: Yup.boolean()
  //       .required('Required field')
  //       .when('notHaveTin', {
  //         is: true,
  //         then: schema => schema.required(),
  //         otherwise: schema => schema.notRequired(),
  //       }),
  //   })
  // ),
});
