import { CurrencyCode } from '@common/constants/currency';
import { ProductCode } from '@common/constants/product';

export const openAccountDefaultValues = {
  accountNo: '',
  amount: '',
  currency: CurrencyCode.CAD,
  intendedUseAccount: '',
  intendedUseAccountDisplay: '',
  tpd_chk: false,
  debitCardIssuance: false,
  dep_cvsr_bnkerno: '',
  thirdPartyChecked: 'N',
};

export const termLongMonthOptions = [
  {
    label: '12m',
    value: 12,
  },
  {
    label: '24m',
    value: 24,
  },
  {
    label: '36m',
    value: 36,
  },
  {
    label: '60m',
    value: 60,
  },
];

export const termShortMonthOptions = [
  {
    label: '6m',
    value: 6,
  },
  {
    label: '12m',
    value: 12,
  },
  {
    label: '24m',
    value: 24,
  },
  {
    label: '36m',
    value: 36,
  },
];

export const openAccountTermMonthOptions = [
  {
    label: '12m',
    value: 12,
  },
  {
    label: '24m',
    value: 24,
  },
  {
    label: '36m',
    value: 36,
  },
  {
    label: '60m',
    value: 60,
  },
];

export const openAccountTermDayOptions = [
  {
    label: '30d',
    value: 30,
  },
  {
    label: '60d',
    value: 60,
  },
  {
    label: '90d',
    value: 90,
  },
  {
    label: '180d',
    value: 180,
  },
];

export const termOptionsBaseProductCode = {
  [ProductCode.E_POWER_TERM_DEPOSIT]: termLongMonthOptions,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: termLongMonthOptions,
  [ProductCode.E_LONG_TERM_GIC]: termLongMonthOptions,
  [ProductCode.E_SHORT_TERM_GIC]: openAccountTermDayOptions,
  [ProductCode.E_INSTALLMENT_SAVING]: termShortMonthOptions,
  [ProductCode.TFSA_E_GIC]: openAccountTermDayOptions,
  [ProductCode.RRSP_E_GIC]: openAccountTermDayOptions,
};

export const thirdPartyActiveOptions = [
  {
    label: 'Yes',
    value: 'Y',
  },
  {
    label: 'No',
    value: 'N',
  },
];
