import LoginCard from '@common/components/organisms/CardGroup/LoginCard/LoginCard';
import React from 'react';


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
