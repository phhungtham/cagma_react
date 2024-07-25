import React from 'react';
import List from '@common/ui/components/atomic/ListGroup/List';
import { CheckingIcon, ShareIcon } from 'assets/icons';
import BearImage from '../../../assets/images/bear-profile.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/List/Default List',
  component: List
};

const Template = args => <List {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' }
};

export const Caption2 = Template.bind({});
Caption2.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 2, caption1: 'Transaction ', caption2: ' notifications' }
};

export const Icon = Template.bind({});
Icon.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 2, caption1: 'Transaction ', caption2: ' notifications' },
  icon: <ShareIcon />
};

export const Thumbnail = Template.bind({});
Thumbnail.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 2, caption1: 'Transaction ', caption2: ' notifications' },
  thumbnail: <CheckingIcon/>,
  icon: <ShareIcon />
};

export const Label = Template.bind({});
Label.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  label: 'Label',
  captionSegments: { type: 2, caption1: 'Transaction ', caption2: ' notifications' },
  thumbnail: <CheckingIcon/>,
  icon: <ShareIcon />
};
