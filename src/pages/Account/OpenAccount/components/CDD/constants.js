import { openAccountCDDLabels } from '@common/constants/labels';

export const accountReceiveLargeTransferOptions = [
  {
    label: openAccountCDDLabels.yes,
    value: '1',
  },
  {
    label: openAccountCDDLabels.no,
    value: '0',
  },
];

export const CDDSelectType = {
  COUNTRY: 'country',
  RELATIONSHIP: 'relationship',
  AMOUNT: 'amount',
};

export const cddRelationshipOther = '05';
