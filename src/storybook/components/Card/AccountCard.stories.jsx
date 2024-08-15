import React from 'react';

import { PipIcon } from 'assets/icons';
import AccountCard from '@common/components/organisms/CardGroup/AccountCard/AccountCard';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/AccountCardTemp',
  component: AccountCard
};

const AccountCardStory = args => <AccountCard icon={<PipIcon />} {...args} />;

export const AccountCardTemp = AccountCardStory.bind({});
AccountCardTemp.args = {
  icon: '',
  afterLoginImage: '',
  cardQuantity: 3,
  variant: 'secondary',
  accountType: 'checking',
  balance: '1,000,000,000',
  currencyUnit: 'VND',
  noButton: false,
  graph: {
    paymentsMade: 20,
    paymentsTotal: 100
  },
  balanceStatus: true,
  switchButton: true,
  pendingNum: 2,
  firstButton: {
    onClick: () => {},
    label: 'Button'
  },
  secondButton: {
    onClick: () => {},
    label: 'Button'
  }
};
