import AccountBanner from '@common/ui/components/atomic/BannerGroup/AccountBanner';
import EventBanner from '@common/ui/components/atomic/BannerGroup/EventsBanner';
import { ShareIcon } from 'assets/icons';
import React from 'react';
import BearImage from '../../../assets/images/BearHome2.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Banner/Event Banner',
  component: EventBanner
};

const Template = args => (
  <EventBanner {...args}/>
);

export const LabelOff = Template.bind({});
LabelOff.args = {
  heading: 'Install the Shinhan Sol and get more benefits!',
  description: 'Install the Shinhan Sol and get more benefits!',
  date: { timeStart: '01.02.2022', timeEnd: '03.04.2024' },
  thumbnail : BearImage
};

export const LabelOn = Template.bind({});
LabelOn.args = {
  heading: 'Install the Shinhan Sol and get more  benefits!',
  description:
    'Open an savings account with a preferential  interest rate for the new year ratee new year ratee new year ratee new year rate for the new year ',
  title: 'End of Year',
  date: { timeStart: '01.02.2022', timeEnd: '03.04.2024', position: 'bottom' },
  label: 'D-5',
  icon: <ShareIcon/>,
  thumbnail : BearImage
};
