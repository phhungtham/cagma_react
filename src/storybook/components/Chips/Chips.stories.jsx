import Chips from '@common/components/atoms/Chips';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Chips/Chip',
  component: Chips,
};

const Template = args => <Chips {...args} />;

export const AmountChip = Template.bind({});
AmountChip.args = {
  label: 'Label',
  type: 'amount',
};
export const DefaultChip = Template.bind({});
DefaultChip.args = {
  label: 'Label',
  segments: [
    { label: 'label1', value: 'label1' },
    { label: 'label2', value: 'label2' },
  ],
};
