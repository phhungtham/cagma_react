import * as Yup from 'yup';

export const SignUpPersonalDetailSchema = Yup.object().shape({
  title: Yup.string().required('Required field'),
  firstName: Yup.string(),
  middleName: Yup.string(),
  lastName: Yup.string(),
  dob: Yup.string(),
  dob_display: Yup.string(),
  cellNumber: Yup.string().required('Required field'),
  emailAddress: Yup.string(),
  country: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
  aptNumber: Yup.string().required('Required field'),
  address: Yup.string().required('Required field'),
  streetNumber: Yup.string().required('Required field'),
  streetName: Yup.string().required('Required field'),
  city: Yup.string().required('Required field'),
  province: Yup.string().required('Required field'),
  showAdditionalInfo: Yup.boolean().required(),
  employmentStatus: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation1: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation2: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation3: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  nationality: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  residentialStatus: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  notSin: Yup.boolean(),
  sin: Yup.string().when(['showAdditionalInfo', 'notSin'], {
    is: (showAdditionalInfo, notSin) => showAdditionalInfo === true && !notSin,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
});

export const VerifyPEPStatusSchema = Yup.object().shape({
  pepDetermination: Yup.string().required(),
  pepRelationship: Yup.string().when('pepDetermination', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepFirstName: Yup.string().when(['pepDetermination', 'pepRelationship'], {
    is: (pepDetermination, pepRelationship) => pepDetermination === 'Y' && pepRelationship === '01',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepLastName: Yup.string().when(['pepDetermination', 'pepRelationship'], {
    is: (pepDetermination, pepRelationship) => pepDetermination === 'Y' && pepRelationship === '01',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepPosition: Yup.string().when('pepDetermination', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepOrganizationName: Yup.string().when('pepDetermination', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepCountry: Yup.string().when('pepDetermination', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepSource: Yup.string().when('pepDetermination', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
});
