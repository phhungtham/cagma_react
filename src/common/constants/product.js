export const ProductPeriodUnitCode = {
  DAY: '1',
  WEEK: '2',
  MONTH: '3',
  QUARTER: '4',
  YEAR: '5',
};

export const PeriodUnitCodeDisplay = {
  [ProductPeriodUnitCode.DAY]: 'Days',
  [ProductPeriodUnitCode.WEEK]: 'Weeks',
  [ProductPeriodUnitCode.MONTH]: 'Months',
  [ProductPeriodUnitCode.QUARTER]: 'Quarters',
  [ProductPeriodUnitCode.YEAR]: 'Years',
};

export const ProductTab = {
  BANKING: '1',
  INVESTMENT: '2',
  BORROWING: '3',
};

export const ProductTabDisplay = {
  [ProductTab.BANKING]: 'Banking',
  [ProductTab.INVESTMENT]: 'Investment',
  [ProductTab.BORROWING]: 'Borrowing',
};

export const ProductCode = {
  E_SAVING: '5117020025',
  TFSA_E_SAVINGS: '5117020027',
  RRSP_E_SAVINGS: '5117020028',
  E_INSTALLMENT_SAVING: '5117090007',
  E_POWER_TERM_DEPOSIT: '5117030020',
  E_GREEN_TERM_DEPOSIT: '5117030021',
  E_SHORT_TERM_GIC: '5117030039',
  E_LONG_TERM_GIC: '5117030040',
  E_LONG_MATURITY: '5117030041',
  TFSA_E_GIC: '5117030042',
  RRSP_E_GIC: '5117030043',
  CHEQUING: '5117000008',
};

export const RequiredAccountBaseProductCode = {
  [ProductCode.TFSA_E_GIC]: ProductCode.TFSA_E_SAVINGS,
  [ProductCode.RRSP_E_GIC]: ProductCode.RRSP_E_SAVINGS,
};
