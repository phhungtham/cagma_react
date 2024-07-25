import Chips from '@common/ui/components/atomic/Chips';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Chips/Chip',
  component: Chips
};

const Template = args => <Chips {...args} />;

export const AmountChip = Template.bind({});
AmountChip.args = {
  label: 'Label',
  type: 'amount'
};
export const DefaultChip = Template.bind({});
DefaultChip.args = {
  label: 'Label',
  segments: 2
};
export const SmallChip = Template.bind({});
SmallChip.args = {
  label: 'Label',
  type: 'small',
  segments: 4
};
