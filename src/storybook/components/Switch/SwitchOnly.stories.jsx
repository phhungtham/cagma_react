import React from 'react';
import Switch from '@atomic/Switch';
import { action, actions } from '@storybook/addon-actions';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Switch/Switch Only',
  component: Switch
};

const Template = args => <Switch {...args} onChange={action('Active Status')} />;

export const SwitchOnly = Template.bind({});
SwitchOnly.args = {
  positionSelected: 'right'
};

export const SelectedRight = Template.bind({});
SelectedRight.args = {
  positionSelected: 'right'
};

export const SelectedLeft = Template.bind({});
SelectedLeft.args = {
  positionSelected: 'left'
};
