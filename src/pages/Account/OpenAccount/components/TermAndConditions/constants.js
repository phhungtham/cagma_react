import BankingSavingImg from '@assets/images/account-banking-saving.png';
import ChequingImg from '@assets/images/account-chequing.png';
import GreenTermDepositImg from '@assets/images/account-green-term-deposit.png';
import InstallmentSavingDepositImg from '@assets/images/account-installment-saving-deposit.png';
import LongTermGicMaturityImg from '@assets/images/account-long-term-gic-maturity.png';
import LongTermGicMonthlyImg from '@assets/images/account-long-term-gic-monthly.png';
import PowerTermDepositImg from '@assets/images/account-power-term-deposit.png';
import RrspGicImg from '@assets/images/account-rrsp-gic.png';
import RrspSavingImg from '@assets/images/account-rrsp-saving.png';
import ShortTermGicImg from '@assets/images/account-short-term-gic.png';
import TfsaGicImg from '@assets/images/account-tfsa-gic.png';
import TfsaSaving from '@assets/images/account-tfsa-saving.png';
import { ProductCode } from '@common/constants/product';

export const OpenAccountTermFile = {
  [ProductCode.CHEQUING]: '/img/511/pdf/5117020025',
  [ProductCode.E_SAVING]: '/img/511/pdf/5117020025',
  [ProductCode.TFSA_E_SAVINGS]: '/img/511/pdf/5117020027',
  [ProductCode.RRSP_E_SAVINGS]: '/img/511/pdf/5117020028',
  [ProductCode.E_INSTALLMENT_SAVING]: '/img/511/pdf/5117090007',
  [ProductCode.E_POWER_TERM_DEPOSIT]: '/img/511/pdf/5117030020',
  [ProductCode.E_GREEN_TERM_DEPOSIT]: '/img/511/pdf/5117030021',
  [ProductCode.E_SHORT_TERM_GIC]: '/img/511/pdf/5117030039',
  [ProductCode.E_LONG_TERM_GIC]: '/img/511/pdf/5117030040',
  [ProductCode.E_LONG_MATURITY]: '/img/511/pdf/5117030041',
  [ProductCode.TFSA_E_GIC]: '/img/511/pdf/5117030042',
  [ProductCode.RRSP_E_GIC]: '/img/511/pdf/5117030043',
};

export const OpenAccountBanner = {
  [ProductCode.E_SAVING]: BankingSavingImg,
  [ProductCode.TFSA_E_SAVINGS]: TfsaSaving,
  [ProductCode.RRSP_E_SAVINGS]: RrspSavingImg,
  [ProductCode.E_INSTALLMENT_SAVING]: InstallmentSavingDepositImg,
  [ProductCode.E_POWER_TERM_DEPOSIT]: PowerTermDepositImg,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: GreenTermDepositImg,
  [ProductCode.E_SHORT_TERM_GIC]: ShortTermGicImg,
  [ProductCode.E_LONG_TERM_GIC]: LongTermGicMonthlyImg,
  [ProductCode.E_LONG_MATURITY]: LongTermGicMaturityImg,
  [ProductCode.TFSA_E_GIC]: TfsaGicImg,
  [ProductCode.RRSP_E_GIC]: RrspGicImg,
  [ProductCode.CHEQUING]: ChequingImg,
};
