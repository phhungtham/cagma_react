import BankBalance from '@assets/images/BankBalance.png';
import BankMoney from '@assets/images/BankMoney.png';
import BorrowingCredit from '@assets/images/borrowing-credit.png';
import BorrowingLoan from '@assets/images/borrowing-loan.png';
import BorrowingMortgage from '@assets/images/borrowing-mortgage.png';
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

export const keyBorrowing = {
  title: 'Borrowing',
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
