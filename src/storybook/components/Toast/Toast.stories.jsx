import Toast from '@common/components/atoms/Toast';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Toast/Toast',
  component: Toast
};

const Template = args => <Toast {...args} />;

export const ToastSingleLine = Template.bind({});
ToastSingleLine.args = {
  message: 'Complete to hide the account'
};
export const ToastMultipleLine = Template.bind({});
ToastMultipleLine.args = {
  message: 'Complete to hide the account, Thank you and see you again.'
};
