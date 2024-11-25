import { DepositSubjectClass } from '@common/constants/deposit';
import { openAccountLabels as labels } from '@common/constants/labels';
import { ProductCode, ProductPeriodUnitCode } from '@common/constants/product';
import {
  selectGreenTermsOptions,
  selectTermsByDateOptions,
  selectTermsByLongDateOptions,
  selectTermsByMonthOptions,
} from '@common/constants/terms';

export const OPEN_ACCOUNT_STEP = {
  CDD: 'cdd',
  DTR: 'dtr',
  VIEW_TERMS: 'viewTerms',
  ENTER_ACCOUNT_INFORMATION: 'enterAccountInformation',
  COMPLETED: 'completed',
};

export const accountFormMapFields = {
  accountNo: 'acno',
  amount: 'trx_amt',
  intendedUseAccount: 'dep_ac_usag_d',
  debitCardIssuance: 'credit_chk',
  thirdPartyChecked: 'tpd_chk',
  referralCode: 'dep_cvsr_bnkerno',
  thirdPartyName: 'tpd_nm',
  address: 'tpd_adr1',
  city: 'tpd_adr2',
  province: 'tpd_state_c',
  postalCode: 'tpd_adr_zipc',
  occupation: 'tpd_job_nm',
  relationship: 'tpd_cus_relt_ctt',
  dob: 'tpd_bth_y4mm_dt',
  currency: 'trx_ccy_c',
};

export const ProductType = {
  [DepositSubjectClass.REGULAR_SAVING]: 'banking',
  [DepositSubjectClass.INSTALLMENT_SAVING]: 'investment',
  [DepositSubjectClass.TERM_DEPOSIT_GIC]: 'investment',
};

export const UnitCodeWithPeriodType = {
  [ProductPeriodUnitCode.DAY]: 'D',
  [ProductPeriodUnitCode.WEEK]: 'W',
  [ProductPeriodUnitCode.MONTH]: 'M',
  [ProductPeriodUnitCode.QUARTER]: 'Q',
  [ProductPeriodUnitCode.YEAR]: 'Y',
};

export const TermRequestUnitCode = {
  DAY: 'D',
  WEEK: 'W',
  MONTH: 'M',
  QUARTER: 'Q',
  YEAR: 'Y',
};

export const TermUnitCodeDisplay = {
  [TermRequestUnitCode.DAY]: 'days',
  [TermRequestUnitCode.WEEK]: 'weeks',
  [TermRequestUnitCode.MONTH]: 'months',
  [TermRequestUnitCode.QUARTER]: 'quarters',
  [TermRequestUnitCode.YEAR]: 'years',
};

export const requiredTermProductCodes = [
  ProductCode.E_INSTALLMENT_SAVING,
  ProductCode.E_POWER_TERM_DEPOSIT,
  ProductCode.E_GREEN_TERM_DEPOSIT,
  ProductCode.E_LONG_TERM_GIC,
  ProductCode.E_LONG_MATURITY,
  ProductCode.E_SHORT_TERM_GIC,
  ProductCode.TFSA_E_GIC,
  ProductCode.RRSP_E_GIC,
];

export const ignoreCheckDTRProductCodes = [
  ProductCode.TFSA_E_GIC,
  ProductCode.RRSP_E_GIC,
  ProductCode.TFSA_E_SAVINGS,
  ProductCode.RRSP_E_SAVINGS,
];

export const ignoreCheckSINNumberProductCodes = [
  ProductCode.TFSA_E_GIC,
  ProductCode.RRSP_E_GIC,
  ProductCode.TFSA_E_SAVINGS,
  ProductCode.RRSP_E_SAVINGS,
];

export const TermOptionsWithProductCode = {
  [ProductCode.E_POWER_TERM_DEPOSIT]: selectTermsByMonthOptions,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: selectGreenTermsOptions,
  [ProductCode.E_LONG_TERM_GIC]: selectTermsByMonthOptions,
  [ProductCode.E_LONG_MATURITY]: selectTermsByMonthOptions,
  [ProductCode.E_SHORT_TERM_GIC]: selectTermsByDateOptions,
  [ProductCode.TFSA_E_GIC]: selectTermsByLongDateOptions,
  [ProductCode.RRSP_E_GIC]: selectTermsByLongDateOptions,
};

export const OpenAccountDescriptions = {
  [ProductCode.E_SAVING]: labels.eSavingDesc,
  [ProductCode.TFSA_E_SAVINGS]: labels.tfsaESavingDesc,
  [ProductCode.RRSP_E_SAVINGS]: labels.rrspESavingDesc,
  [ProductCode.E_INSTALLMENT_SAVING]: labels.eInstallmentDesc,
  [ProductCode.E_POWER_TERM_DEPOSIT]: labels.ePowerTermDesc,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: labels.eGreenTermDesc,
  [ProductCode.E_SHORT_TERM_GIC]: labels.eShortTermDesc,
  [ProductCode.E_LONG_TERM_GIC]: labels.eLongTermMonthlyDesc,
  [ProductCode.E_LONG_MATURITY]: labels.eLongTermMaturityDesc,
  [ProductCode.TFSA_E_GIC]: labels.tfsaEGicDesc,
  [ProductCode.RRSP_E_GIC]: labels.rrspEGicDesc,
  [ProductCode.CHEQUING]: labels.chequingDesc,
};
