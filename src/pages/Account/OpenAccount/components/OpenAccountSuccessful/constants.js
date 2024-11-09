import { openAccountLabels as labels } from '@common/constants/labels';
import { ProductCode } from '@common/constants/product';

export const chequingSuccessFields = [
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
    label: 'Transaction limit',
    value: 'limit',
  },
  {
    label: 'Number of Transactions',
    value: 'numberTransactions',
  },
];

export const eSavingSuccessFields = [
  {
    label: labels.productName,
    value: 'productName',
  },
  {
    label: labels.accountNo,
    value: 'acNo',
  },
  {
    label: labels.interestRate3,
    value: 'interestRate',
  },
  {
    label: labels.amount2,
    value: 'amount',
  },
  {
    label: labels.depositFrom,
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

export const openAccountSuccessFields = {
  [ProductCode.CHEQUING]: chequingSuccessFields,
  [ProductCode.E_SAVING]: eSavingSuccessFields,
  [ProductCode.TFSA_E_SAVINGS]: eSavingSuccessFields,
  [ProductCode.E_POWER_TERM_DEPOSIT]: termDepositSuccessFields,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: termDepositSuccessFields,
  [ProductCode.E_LONG_TERM_GIC]: termDepositSuccessFields,
  [ProductCode.E_LONG_MATURITY]: termDepositSuccessFields,
  [ProductCode.E_SHORT_TERM_GIC]: termDepositSuccessFields,
  [ProductCode.E_INSTALLMENT_SAVING]: eInstallSuccessFields,
  [ProductCode.TFSA_E_GIC]: termDepositSuccessFields,
  [ProductCode.RRSP_E_SAVINGS]: eSavingSuccessFields,
  [ProductCode.RRSP_E_GIC]: termDepositSuccessFields,
};
