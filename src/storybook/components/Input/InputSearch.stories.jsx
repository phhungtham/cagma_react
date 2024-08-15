import InputSearch from '@common/components/atoms/Input/InputSearch';
import { INPUT_MODE, SIZE } from '@common/components/constants';
import { action } from '@storybook/addon-actions';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/Input Search',
  component: InputSearch
};

const Template = args => <InputSearch {...args} onChange={action('Input Pin Value')} />;

export const Normal = Template.bind({});
Normal.args = {
  mode: INPUT_MODE.NORMAL,
  placeHolder: 'Search here...'
};
export const OnBackground = Template.bind({});
OnBackground.args = {
  mode: INPUT_MODE.ON_BACKGROUND,
  placeHolder: 'Search here...'
};

export const Small = Template.bind({});
Small.args = {
  size: SIZE.SMALL,
  placeHolder: 'Search here...'
};

export const Large = Template.bind({});
Large.args = {
  size: SIZE.LARGE,
  placeHolder: 'Search here...'
};
export const HasCancel = Template.bind({});
HasCancel.args = {
  placeHolder: 'Search here...',
  onCancel: () => {}
};
export const HasCancelOnBackground = Template.bind({});
HasCancelOnBackground.args = {
  mode: INPUT_MODE.ON_BACKGROUND,
  placeHolder: 'Search here...',
  onCancel: () => {}
};
