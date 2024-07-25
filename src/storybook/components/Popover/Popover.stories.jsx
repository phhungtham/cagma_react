import Popover from '@common/ui/components/atomic/Popover';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Popover/Popover Single Line',
  component: Popover
};

const Template = args => <Popover {...args} />;

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
