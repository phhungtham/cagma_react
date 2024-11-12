import { openAccountLabels as labels } from '@common/constants/labels';
import { ProductCode } from '@common/constants/product';

export const chequingSuccessFields = [
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
    label: labels.transactionLimit,
    value: 'limit',
  },
  {
    label: labels.numberOfTransactions2,
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
    label: labels.terms2,
    value: 'term',
  },
  {
    label: labels.maturityDate2,
    value: 'maturityDate',
  },
  {
    label: labels.maturityOption,
    value: 'maturityOption',
  },
  {
    label: labels.depositFrom,
    value: 'depositFrom',
  },
];

export const eInstallSuccessFields = [
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
    label: labels.terms2,
    value: 'term',
  },
  {
    label: labels.maturityDate2,
    value: 'maturityDate',
  },
  {
    label: labels.paymentDateEachSession2,
    value: 'paymentEachSession',
  },
  {
    label: labels.depositFrom,
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
