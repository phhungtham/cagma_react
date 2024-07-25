import InputPin from '@common/ui/components/atomic/Input/InputPin';
import { INPUT_MODE } from '@common/ui/constants';
import { action } from '@storybook/addon-actions';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/Input Pin',
  component: InputPin
};

const Template = args => <InputPin {...args} onChange={action('Input Pin Value')} />;

export const Normal = Template.bind({});
Normal.args = {
  mode: INPUT_MODE.NORMAL,
  stepsNumber: 6
};
export const OnBackground = Template.bind({});
OnBackground.args = {
  mode: INPUT_MODE.ON_BACKGROUND,
  stepsNumber: 6
};

export const CustomStep = Template.bind({});
CustomStep.args = {
  stepsNumber: 4
};
export const CustomErrors = Template.bind({});
CustomErrors.args = {
  stepsNumber: 6,
  errorMsg: 'Passwords do not match'
};
