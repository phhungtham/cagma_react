import React from 'react';

import { CardIcon } from 'assets/icons';
import MyAccountCard from '@common/ui/components/atomic/CardGroup/MyAccountCard/MyAccountCard';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/AccountCardTemp',
  component: MyAccountCard
};

const MyAccountCardStory = args => <MyAccountCard {...args} />;

export const MyAccountCardTemp = MyAccountCardStory.bind({});
MyAccountCardTemp.args = {
  type: 'checking',
  title: 'Account name',
  subtitle: '123-456-000111',
  cardQuantity: '1.000.000.000 VND',
  alertMessage: 'Dormant account',
  noButton: false,
  initialShow: true,
  header: true,
  icon: <CardIcon />,
  showBalance: true
};
