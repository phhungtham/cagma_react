import * as Yup from 'yup';

export const cddFormSchema = Yup.object().shape({
  accountReceiveTransferYN: Yup.string().oneOf(['0', '1'], 'Value must be Yes or No').required('Required field'),
  frequency: Yup.string().when('accountReceiveTransferYN', {
    is: '1',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  country: Yup.string().when('accountReceiveTransferYN', {
    is: '1',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  relationship: Yup.string().when('accountReceiveTransferYN', {
    is: '1',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  otherRelationship: Yup.string().when(['accountReceiveTransferYN', 'relationship'], {
    is: (accountReceiveTransferYN, relationship) => accountReceiveTransferYN === '1' && relationship === '05',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
  amount: Yup.string().when('accountReceiveTransferYN', {
    is: '1',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired(),
  }),
});
