import Currency from '@common/ui/components/atomic/Currency';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Currency/Currency',
  component: Currency
};

const Template = args => <Currency {...args} />;

export const CurrencyStories = Template.bind({});
CurrencyStories.args = {
  amount: '1.000.000.000',
  unit: 'USD'
};
