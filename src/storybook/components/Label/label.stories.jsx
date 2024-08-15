import Label from '@common/components/atoms/Label';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Label/Label',
  component: Label
};

const Template = args => <Label {...args} />;

export const Filled = Template.bind({});
Filled.args = {
  variant: 'primary',
  type: 'filled'
};
export const Outline = Template.bind({});
Outline.args = {
  variant: 'primary',
  type: 'outline'
};
export const Ghost = Template.bind({});
Ghost.args = {
  variant: 'primary',
  type: 'ghost'
};
