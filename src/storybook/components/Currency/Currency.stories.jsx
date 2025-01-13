import Currency from '@common/components/atoms/Currency';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Currency/Currency',
  component: Currency,
};

const Template = args => <Currency {...args} />;

export const CurrencyStories = Template.bind({});
CurrencyStories.args = {
  amount: '1.000.000.000',
  unit: 'USD',
};
