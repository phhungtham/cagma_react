import React from 'react';
import BearImage from '../../../assets/images/bear-profile.png';
import Notification from '@common/ui/components/atomic/Notification';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/List/Notification',
  component: Notification
};

const Template = args => <Notification {...args} />;

export const Default = Template.bind({});
Default.args = {
  notifyContent: 'Deposit of USD 100,000.00 from Maria(*8888) to *1234',
  time: '27.03.2022 13:05',
  thumbnailType: 'withdraw',
};

export const TransactionWithdrawal = Template.bind({});
TransactionWithdrawal.args = {
  title: 'Bohyun Kim',
  notifyType: 'transaction',
  time: '27.03.2022 13:05',
  thumbnail: BearImage,
  currency: { amount: '891,623,000', unit: 'VND', type: 'withdraw' },
  isRead: true
};

export const TransactionDeposit = Template.bind({});
TransactionDeposit.args = {
  title: 'Bohyun Kim',
  notifyType: 'transaction',
  time: '27.03.2022 13:05',
  thumbnail: BearImage,
  currency: { amount: '891,623,000', unit: 'VND', type: 'deposit' }
};

export const NotifyEventBanner = Template.bind({});
NotifyEventBanner.args = {
  notifyType: 'event-banner',
  notifyContent: 'If you pass the diary and find a lovely character, you`ll be chosen!',
  time: '27.03.2022 13:05',
  thumbnail: BearImage
};

export const NotifyHomeBanner = Template.bind({});
NotifyHomeBanner.args = {
  notifyType: 'home-banner',
  title: 'Shinhan Bank Golden Tiger Event',
  notifyContent: 'Open an savings account with a preferential interest rate for the new year ',
  thumbnail: BearImage
};
