import ShortCard from '@common/components/organisms/CardGroup/ShortCard/ShortCard';
import React from 'react';


// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/ShortCardTemp',
  component: ShortCard
};

const ShortCardStory = args => <ShortCard {...args} />;

export const ShortCardTemp = ShortCardStory.bind({});
ShortCardTemp.args = {
  title: 'All accounts',
  subTitle: '21,456,456,897,812 VND',
  variant: 'setting',
  type: 'more'
};
