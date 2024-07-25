import React from 'react';

import LoginCard from '@atomic/CardGroup/LoginCard/LoginCard';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/LoginCard',
  component: LoginCard
};

const LoginCardStory = args => <LoginCard {...args} />;

export const LoginCardTemp = LoginCardStory.bind({});
LoginCardTemp.args = {
  isLogin: true,
  afterLoginImage: '',
  isJoinCard: true
};
