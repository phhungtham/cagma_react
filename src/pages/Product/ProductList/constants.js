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

export const DescriptionMapProductCode = {
  [ProductCode.E_SAVING]:
    'This product provides high interest rate even for a day saving with convenient deposit and withdrawl system.',
  [ProductCode.TFSA_E_SAVINGS]: 'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.RRSP_E_SAVINGS]: 'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.E_INSTALLMENT_SAVING]:
    'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.E_POWER_TERM_DEPOSIT]: 'Save money and get the high interest rate at maturity date.',
  [ProductCode.E_GREEN_TERM_DEPOSIT]:
    'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.E_SHORT_TERM_GIC]: 'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.E_LONG_TERM_GIC]: 'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.E_LONG_MATURITY]:
    'This product offers compounded high interest rate for a longer investment period, all through online',
  [ProductCode.TFSA_E_GIC]:
    'TFSA e-GIC(CAD) is best for long-term Investment, which allows obtaining a high yearly compounded interest.',
  [ProductCode.RRSP_E_GIC]: 'This product guarantees the high fixed interest rate even for short term deposit.',
  [ProductCode.CHEQUING]:
    'This online product offers tax-sheltered growth and flexibility and withdraw according to your needs.',
};

export const borrowings = [
  {
    name: 'Mortgage',
    desc: 'Find flexible and affordable mortgage options most suitable for you',
    content: 'Purchasing a new home Accessing the equity through refinance Home Equity Line of Credit',
    img: BorrowingMortgage,
  },
  {
    name: 'Line of credit',
    desc: 'Flexible way to borrow: borrow, repay and borrow again!',
    content: 'Revolving credit limit Pay interest only on the amount borrowed',
    img: BorrowingCredit,
  },
  {
    name: 'Personal Loan',
    desc: 'For customers in need of short term personal borrowing',
    content: 'Secured/Unsecured personal loans RRSP loans',
    img: BorrowingLoan,
  },
];
