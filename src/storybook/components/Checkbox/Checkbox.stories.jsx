import React from 'react';
import { action } from '@storybook/addon-actions';
import { SIZE } from '@common/components/constants';
import CheckBox from '@common/components/atoms/Checkbox';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Checkbox/Checkbox',
  component: CheckBox
};

const Template = args => <CheckBox {...args} onChange={action('Checked')} />;

export const CheckBoxSmall = Template.bind({});
CheckBoxSmall.args = {
  size: SIZE.SMALL
};

export const CheckBoxLarge = Template.bind({});
CheckBoxLarge.args = {
  size: SIZE.LARGE
};
