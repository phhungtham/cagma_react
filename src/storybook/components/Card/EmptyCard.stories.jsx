import React from 'react';
import EmptyCard from '@common/ui/components/atomic/CardGroup/EmptyCard/EmptyCard';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/EmptyCardTemp',
  component: EmptyCard
};

const EmptyCardStory = args => <EmptyCard {...args} />;

export const EmptyCardTemp = EmptyCardStory.bind({});
EmptyCardTemp.args = {
  title: 'You do not own any checkings accounts.',
  type: 'checking',
  buttonTitle: 'Browse products',
  header: false
};
