import AccountBanner from '@common/ui/components/atomic/BannerGroup/AccountBanner';
import React from 'react';
import BearImage from '../../../assets/images/BearHome2.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Banner/Account Banner',
  component: AccountBanner
};

const Template = args => (
  <AccountBanner {...args}>
    <img src={BearImage} alt="" />
  </AccountBanner>
);

export const Normal = Template.bind({});
Normal.args = {
  type : 'normal',
  button : 'Browser products',
  description: 'Open an savings account with a preferential  interest rate for the new year rate for the new year '
};

export const Handler = Template.bind({});
Handler.args = {
  type : 'normal',
  button : 'Add +',
  heading : 'Quick Transfer',
  description: 'Open an savings account with a preferential  interest rate for the new year rate for the new year '
};
