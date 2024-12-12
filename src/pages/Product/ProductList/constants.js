import BankingSavingImg from '@assets/images/banking-saving.png';
import BorrowingCreditImg from '@assets/images/borrowing-credit.png';
import BorrowingLoanImg from '@assets/images/borrowing-loan.png';
import BorrowingMortgageImg from '@assets/images/borrowing-mortgage.png';
import ChequingImg from '@assets/images/chequing.png';
import GreenTermDepositImg from '@assets/images/green-term-deposit.png';
import InstallmentSavingDepositImg from '@assets/images/installment-saving-deposit.png';
import LongTermGicMaturityImg from '@assets/images/long-term-gic-maturity.png';
import LongTermGicMonthlyImg from '@assets/images/long-term-gic-monthly.png';
import PowerTermDepositImg from '@assets/images/power-term-deposit.png';
import RrspGicImg from '@assets/images/rrsp-gic.png';
import RrspSavingImg from '@assets/images/rrsp-saving.png';
import ShortTermGicImg from '@assets/images/short-term-gic.png';
import TfsaGicImg from '@assets/images/tfsa-gic.png';
import TfsaSaving from '@assets/images/tfsa-saving.png';
import { productLabels as labels } from '@common/constants/labels';
import { ProductCode } from '@common/constants/product';

export const BannerMapProductCode = {
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

export const keyBorrowing = {
  title: 'Borrowing',
};

export const ProductListDescriptions = {
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

export const borrowings = [
  {
    name: labels.mortgage,
    desc: labels.mortgageDesc,
    content1: labels.mortgageContent1,
    content2: labels.mortgageContent2,
    content3: labels.mortgageContent3,
    img: BorrowingMortgageImg,
  },
  {
    name: labels.lineOfCredit,
    desc: labels.lineOfCreditDesc,
    content1: labels.lineCreditContent1,
    content2: labels.lineCreditContent2,
    img: BorrowingCreditImg,
  },
  {
    name: labels.personalLoan,
    desc: labels.personalLoanDesc,
    content1: labels.personalLoanContent1,
    content2: labels.personalLoanContent2,
    img: BorrowingLoanImg,
  },
];
