import React from 'react';

import Toast from '@common/components/atoms/Toast';
import { CheckIcon } from 'assets/icons';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Toast/Toast With Icon',
  component: Toast,
};

const Template = args => (
  <Toast {...args}>
    <CheckIcon />
  </Toast>
);

export const ToastSingleLine = Template.bind({});
ToastSingleLine.args = {
  message: 'Complete to hide the account',
};
export const ToastMultipleLine = Template.bind({});
ToastMultipleLine.args = {
  lineOfText: 'multiple',
  message: 'Enter at least Double lines text string Lorem ipsum dolo. text string Lorem ipsum dolo.',
};
