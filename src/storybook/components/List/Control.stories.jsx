import React from 'react';
import List from '@common/ui/components/atomic/ListGroup/List';
import { ShareIcon } from 'assets/icons';
import BearImage from '../../../assets/images/bear-profile.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/List/Control List',
  component: List
};

const Template = args => <List {...args} />;

export const Select = Template.bind({});
Select.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'select', position: 'right' }
};

export const Switch = Template.bind({});
Switch.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'switch', position: 'right' }
};

export const SwitchDisabled = Template.bind({});
SwitchDisabled.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'switch', position: 'right', disabled: true }
};

export const SwitchActive = Template.bind({});
SwitchActive.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'switch', position: 'right', active: true }
};

export const Button = Template.bind({});
Button.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'button', label: 'Button' }
};
