import Popover from '@common/ui/components/atomic/Popover';
import { CheckIcon } from 'assets/icons';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Popover/Popover With Icon',
  component: Popover
};

const Template = args => (
  <Popover {...args}>
    <CheckIcon />
  </Popover>
);

export const PopoverLight = Template.bind({});
PopoverLight.args = {
  message: 'Complete to hide the account',
  mode: 'light'
};
export const PopoverDark = Template.bind({});
PopoverDark.args = {
  message: 'Complete to hide the account',
  mode: 'dark'
};
export const PopoverWithButton = Template.bind({});
PopoverWithButton.args = {
  message: 'Complete to hide the account',
  mode: 'dark',
  buttonLabel: 'Button'
};
export const PopoverMultipleLine = Template.bind({});
PopoverMultipleLine.args = {
  lineOfText: 'multiple',
  message: 'Complete to hide the account Complete to hide the account. Thank you.',
  mode: 'dark',
  buttonLabel: 'Button'
};
