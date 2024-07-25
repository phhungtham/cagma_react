import React from 'react';
import { action } from '@storybook/addon-actions';
import CheckBox from '@common/ui/components/atomic/Checkbox';
import { SIZE } from '@common/ui/constants';

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
