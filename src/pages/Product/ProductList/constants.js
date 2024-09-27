import BankBalance from '@assets/images/BankBalance.png';
import BankMoney from '@assets/images/BankMoney.png';
import BannerBook from '@assets/images/open-account-book.png';

export const ProductCode = {
  E_SAVING: '5117020025',
  TFSA_E_Savings: '5117020027',
  RRSP_E_Savings: '5117020028',
  E_Installment: '5117090007',
  E_Power: '5117030020',
  E_Green: '5117030021',
  E_Short: '5117030039',
  E_Long_Monthly: '5117030040',
  E_Long_Maturity: '5117030041',
  TFSA_E_GIC: '5117030042',
  RRSP_E_GIC: '5117030043',
};

export const bannerBaseProductCode = {
  [ProductCode.E_SAVING]: BannerBook,
  [ProductCode.TFSA_E_Savings]: BankMoney,
  [ProductCode.RRSP_E_Savings]: BannerBook,
  [ProductCode.E_Installment]: BannerBook,
  [ProductCode.E_Power]: BannerBook,
  [ProductCode.E_Green]: BankBalance,
  [ProductCode.E_Short]: BannerBook,
  [ProductCode.E_Long_Monthly]: BannerBook,
  [ProductCode.E_Long_Maturity]: BannerBook,
  [ProductCode.TFSA_E_GIC]: BannerBook,
  [ProductCode.RRSP_E_GIC]: BannerBook,
};
