import { openAccountLabels } from '@common/constants/labels';

export const accountReceiveLargeTransferOptions = [
  {
    label: openAccountLabels.yes,
    value: '1',
  },
  {
    label: openAccountLabels.no,
    value: '0',
  },
];

export const CDDSelectType = {
  COUNTRY: 'country',
  RELATIONSHIP: 'relationship',
  AMOUNT: 'amount',
};

export const cddRelationshipOther = '05';
