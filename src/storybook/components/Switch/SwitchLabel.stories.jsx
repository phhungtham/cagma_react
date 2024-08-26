import React from 'react';

import Switch from '@atomic/Switch';
import { action } from '@storybook/addon-actions';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Switch/Switch With Label',
  component: Switch,
};

const Template = args => (
  <Switch
    {...args}
    onChange={action('Active Status')}
  />
);

export const TypeLabel = Template.bind({});
TypeLabel.args = {
  label: 'Label',
  positionSelected: 'right',
};

export const TypeList = Template.bind({});
TypeList.args = {
  label: 'Label',
  type: 'list',
  positionSelected: 'right',
};
export const SelectedRight = Template.bind({});
SelectedRight.args = {
  label: 'Label',
  positionSelected: 'right',
};

export const SelectedLeft = Template.bind({});
SelectedLeft.args = {
  label: 'Label',
  positionSelected: 'left',
};
