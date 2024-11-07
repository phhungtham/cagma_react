import BankingSaving from '@assets/images/banking-saving.png';
import BorrowingCredit from '@assets/images/borrowing-credit.png';
import BorrowingLoan from '@assets/images/borrowing-loan.png';
import BorrowingMortgage from '@assets/images/borrowing-mortgage.png';
import Chequing from '@assets/images/chequing.png';
import InstallmentSavingDeposit from '@assets/images/installment-saving-deposit.png';
import BannerBook from '@assets/images/open-account-book.png';
import RrspGic from '@assets/images/rrsp-gic.png';
import RrspSaving from '@assets/images/rrsp-saving.png';
import TfsaSaving from '@assets/images/tfsa-saving.png';
import { productLabels as labels } from '@common/constants/labels';
import { ProductCode } from '@common/constants/product';

export const BannerMapProductCode = {
  [ProductCode.E_SAVING]: BankingSaving,
  [ProductCode.TFSA_E_SAVINGS]: TfsaSaving,
  [ProductCode.RRSP_E_SAVINGS]: RrspSaving,
  [ProductCode.E_INSTALLMENT_SAVING]: InstallmentSavingDeposit,
  [ProductCode.E_POWER_TERM_DEPOSIT]: InstallmentSavingDeposit,
  [ProductCode.E_GREEN_TERM_DEPOSIT]: TfsaSaving,
  [ProductCode.E_SHORT_TERM_GIC]: RrspGic,
  [ProductCode.E_LONG_TERM_GIC]: RrspSaving,
  [ProductCode.E_LONG_MATURITY]: RrspGic,
  [ProductCode.TFSA_E_GIC]: BannerBook,
  [ProductCode.RRSP_E_GIC]: RrspGic,
  [ProductCode.CHEQUING]: Chequing,
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
    img: BorrowingMortgage,
  },
  {
    name: labels.lineOfCredit,
    desc: labels.lineOfCreditDesc,
    content1: labels.lineCreditContent1,
    content2: labels.lineCreditContent2,
    img: BorrowingCredit,
  },
  {
    name: labels.personalLoan,
    desc: labels.personalLoanDesc,
    content1: labels.personalLoanContent1,
    content2: labels.personalLoanContent2,
    img: BorrowingLoan,
  },
];
