import RadioButton from '@common/ui/components/atomic/RadioButton';
import React from 'react';
import { action } from '@storybook/addon-actions';
import { SIZE } from '@common/ui/constants';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Radio/Radio Button',
  component: RadioButton
};

const Template = args => (
  <>
    <RadioButton {...args} onChange={action('Checked')} /> <br />
    <RadioButton {...args} onChange={action('Checked')} />
  </>
);

export const Selected = Template.bind({});
Selected.args = {
  size: SIZE.SMALL
};

export const Disabled = Template.bind({});
Disabled.args = {
  size: SIZE.SMALL,
  selected: true,
  disabled: true
};
