import BankBalance from '@assets/images/BankBalance.png';
import BankMoney from '@assets/images/BankMoney.png';
import BannerBook from '@assets/images/open-account-book.png';
import { ProductCode } from '@common/constants/product';

export const bannerBaseProductCode = {
  [ProductCode.E_SAVING]: BannerBook,
  [ProductCode.TFSA_E_SAVINGS]: BankMoney,
  [ProductCode.RRSP_E_SAVINGS]: BannerBook,
  [ProductCode.E_INSTALLMENT_SAVING]: BannerBook,
  [ProductCode.E_POWER_TERM_DEPOSIT]: BannerBook,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: BankBalance,
  [ProductCode.E_SHORT_TERM_GIC]: BannerBook,
  [ProductCode.E_LONG_TERM_GIC]: BannerBook,
  [ProductCode.E_Long_Maturity]: BannerBook,
  [ProductCode.TFSA_E_GIC]: BannerBook,
  [ProductCode.RRSP_E_GIC]: BannerBook,
};
