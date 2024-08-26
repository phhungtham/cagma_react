import React from 'react';

import BearProfile from '@assets/images/bear-profile.png';
import Profile from '@common/components/molecules/Profile';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Profile/Profile',
  component: Profile,
};

const ProfileTemp = args => <Profile {...args} />;

export const ProfileDefault = ProfileTemp.bind({});
ProfileDefault.args = {};

export const ProfileWithIcon = ProfileTemp.bind({});
ProfileDefault.args = {
  avatarURL: BearProfile,
  badgeURL: '',
};
