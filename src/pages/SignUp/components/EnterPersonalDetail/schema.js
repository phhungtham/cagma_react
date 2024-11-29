import { employmentValuesDisableOccupation } from '@common/constants/account';
import * as Yup from 'yup';

export const SignUpPersonalDetailSchema = Yup.object().shape({
  title: Yup.string().required('Required field'),
  firstName: Yup.string().required('Required field'),
  middleName: Yup.string().nullable(),
  lastName: Yup.string().required('Required field'),
  dob: Yup.string().required('Required field'),
  dob_display: Yup.string(),
  cellNumber: Yup.string().required('Required field'),
  emailAddress: Yup.string().email().required('Required field'),
  country: Yup.string().required('Required field'),
  postalCode: Yup.string().required('Required field'),
  aptNumber: Yup.string(),
  address: Yup.string().required('Required field'),
  streetNumber: Yup.string().required('Required field'),
  streetName: Yup.string().required('Required field'),
  city: Yup.string().required('Required field'),
  province: Yup.string().required('Required field'),
  housePhoneNo: Yup.string(),
  showAdditionalInfo: Yup.boolean().required(),
  employmentStatus: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation1: Yup.string().when(['showAdditionalInfo', 'employmentStatus'], {
    is: (showAdditionalInfo, employmentStatus) =>
      showAdditionalInfo && !employmentValuesDisableOccupation.includes(employmentStatus),
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation2: Yup.string().when(['showAdditionalInfo', 'employmentStatus'], {
    is: (showAdditionalInfo, employmentStatus) =>
      showAdditionalInfo && !employmentValuesDisableOccupation.includes(employmentStatus),
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  occupation3: Yup.string().when('showAdditionalInfo', {
    is: (showAdditionalInfo, employmentStatus) =>
      showAdditionalInfo && !employmentValuesDisableOccupation.includes(employmentStatus),
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
  branchNo: Yup.string().when('showAdditionalInfo', {
    is: true,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  branchDisplay: Yup.string(),
});

export const VerifyPEPStatusSchema = Yup.object().shape({
  pepDetermination: Yup.string().required(),
  pepRelationship: Yup.string().when('pepDetermination', {
    is: 'Y',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepFirstName: Yup.string().when(['pepDetermination', 'pepRelationship'], {
    is: (pepDetermination, pepRelationship) => pepDetermination === 'Y' && pepRelationship !== '01',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  pepLastName: Yup.string().when(['pepDetermination', 'pepRelationship'], {
    is: (pepDetermination, pepRelationship) => pepDetermination === 'Y' && pepRelationship !== '01',
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
