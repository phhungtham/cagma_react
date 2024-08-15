import TotalBalanceCard from '@common/components/organisms/CardGroup/TotalBalanceCard/TotalBalanceCard';
import React from 'react';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/TotalBalanceCardTemp',
  component: TotalBalanceCard
};

const TotalBalanceCardStory = args => <TotalBalanceCard {...args} />;

export const TotalBalanceCardTemp = TotalBalanceCardStory.bind({});
TotalBalanceCardTemp.args = {
  firstValue: {
    currency: '523.00',
    currencyUnit: 'USD'
  },
  secondValue: {
    currency: '4.823.00',
    currencyUnit: 'KHR'
  }
};
