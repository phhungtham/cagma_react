import React from 'react';
import BearImage from '@assets/images/bear-profile.png';
import TransactionHistory from '@common/components/organisms/TransactionHistory';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/List/Transaction History',
  component: TransactionHistory
};

const Template = args => <TransactionHistory {...args} />;

export const Deposit = Template.bind({});
Deposit.args = {
  title: 'Shinhan Kim',
  subTitle: 'Shinhan 8021',
  transactionTime: '13:25',
  currency: { type: 'deposit', amount: '891,623,000', unit: 'USD' }
};

export const Withdrawal = Template.bind({});
Withdrawal.args = {
  title: 'Shinhan Kim',
  subTitle: 'Shinhan 8021',
  transactionTime: '13:25',
  currency: { type: 'withdraw', amount: '891,623,000', unit: 'USD' }
};

export const Thumbnail = Template.bind({});
Thumbnail.args = {
  title: 'Shinhan Kim',
  subTitle: 'Shinhan 8021',
  transactionTime: '13:25',
  thumbnail: BearImage,
  currency: { type: 'deposit', amount: '891,623,000', unit: 'USD' }
};

export const Memo = Template.bind({});
Memo.args = {
  title: 'Shinhan Kim',
  subTitle: 'Shinhan 8021',
  memo: 'Vehicle maintenance costs ',
  transactionTime: '13:25',
  thumbnail: BearImage,
  currency: { type: 'withdraw', amount: '891,623,000', unit: 'USD' }
};

export const CheckingBalanceOn = Template.bind({});
CheckingBalanceOn.args = {
  title: 'Shinhan Kim',
  subTitle: 'Shinhan 8021',
  memo: 'Vehicle maintenance costs ',
  transactionTime: '13:25',
  thumbnail: BearImage,
  currency: { type: 'deposit', amount: '891,623,000', unit: 'USD' },
  transactionBalance: { amount: '1,234,567,891', unit: 'USD' }
};

export const CheckingBalanceOff = Template.bind({});
CheckingBalanceOff.args = {
  title: 'Shinhan Kim',
  memo: 'Money for groceries',
  transactionTime: '13:25',
  thumbnail: BearImage,
  currency: { type: 'withdraw', amount: '891,623,000', unit: 'USD' }
};

export const Savings = Template.bind({});
Savings.args = {
  orderNumber: 1,
  title: 'Automatic transfer',
  transactionTime: '31.04.2022',
  currency: { type: 'deposit', amount: '891,623,000', unit: 'USD' },
  transactionBalance: { amount: '1,200,000,000', unit: 'USD' }
};

export const LoanInterestAmountOff = Template.bind({});
LoanInterestAmountOff.args = {
  title: 'Redemption',
  transactionTime: '11.04.2022',
  currency: { type: 'default', amount: '12,500.00', unit: 'USD' },
  transactionLoan: { outstandingBalance: '9,375,163.04', unit: 'USD' }
};

export const LoanInterestAmountOn = Template.bind({});
LoanInterestAmountOn.args = {
  title: 'Redemption',
  transactionTime: '11.04.2022',
  currency: { type: 'default', amount: '12,500.00', unit: 'USD' },
  transactionLoan: { outstandingBalance: '9,375,163.04', interestAmount: '4,500.00', unit: 'USD' }
};

export const Pending = Template.bind({});
Pending.args = {
  status: 'pending',
  title: 'Shinhan Card withdraw',
  subTitle: 'Processing',
  transactionTime: '11.04.2022',
  currency: { type: 'withdraw', amount: '891,623,000', unit: 'USD' },
  thumbnail: BearImage
};

export const PendingWithMemo = Template.bind({});
PendingWithMemo.args = {
  status: 'pending',
  title: 'Shinhan Card withdraw',
  memo: 'Vehicle maintenance costs ',
  subTitle: 'Processing',
  transactionTime: '11.04.2022',
  currency: { type: 'withdraw', amount: '891,623,000', unit: 'USD' },
  thumbnail: BearImage
};

export const PendingWithCancel = Template.bind({});
PendingWithCancel.args = {
  status: 'pending',
  title: 'Shinhan Card withdraw',
  cancelButton: true,
  memo: 'Vehicle maintenance costs ',
  subTitle: 'Processing',
  transactionTime: '11.04.2022',
  currency: { type: 'withdraw', amount: '891,623,000', unit: 'USD' },
  thumbnail: BearImage
};
