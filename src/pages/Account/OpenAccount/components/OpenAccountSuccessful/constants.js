import { ProductCode } from '@common/constants/product';

export const eSavingSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const tfsaESavingSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Maturity Date',
    value: 'maturityDate',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const tfsaEGICSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Terms',
    value: 'term',
  },
  {
    label: 'Maturity Date',
    value: 'maturityDate',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const termDepositSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Terms',
    value: 'term',
  },
  {
    label: 'Maturity Date',
    value: 'maturityDate',
  },
  {
    label: 'Maturity Option',
    value: 'maturityOption',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const eInstallSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Terms',
    value: 'term',
  },
  {
    label: 'Maturity Date',
    value: 'maturityDate',
  },
  {
    label: 'Payment Date Each Session',
    value: 'paymentEachSession',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const rrspEGICSuccessFields = [
  {
    label: 'Product name',
    value: 'productName',
  },
  {
    label: 'Account no.',
    value: 'acNo',
  },
  {
    label: 'Interest rate',
    value: 'interestRate',
  },
  {
    label: 'Amount',
    value: 'amount',
  },
  {
    label: 'Terms',
    value: 'term',
  },
  {
    label: 'Deposit from',
    value: 'depositFrom',
  },
];

export const openAccountSuccessFields = {
  [ProductCode.E_SAVING]: eSavingSuccessFields,
  [ProductCode.TFSA_E_SAVINGS]: tfsaESavingSuccessFields,
  [ProductCode.E_POWER_TERM_DEPOSIT]: termDepositSuccessFields,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: termDepositSuccessFields,
  [ProductCode.E_LONG_TERM_GIC]: termDepositSuccessFields,
  [ProductCode.E_SHORT_TERM_GIC]: termDepositSuccessFields,
  [ProductCode.E_INSTALLMENT_SAVING]: eInstallSuccessFields,
  [ProductCode.TFSA_E_GIC]: tfsaEGICSuccessFields,
  [ProductCode.RRSP_E_SAVINGS]: eSavingSuccessFields,
  [ProductCode.RRSP_E_GIC]: rrspEGICSuccessFields,
};
