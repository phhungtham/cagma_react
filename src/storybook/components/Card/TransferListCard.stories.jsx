import React from 'react';

import TransferListCard from '@common/components/organisms/CardGroup/TransferListCard/TransferListCard';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Card/TransferListCardTemp',
  component: TransferListCard,
};

const TransferListCardStory = args => <TransferListCard {...args} />;

export const TransferListCardTemp = TransferListCardStory.bind({});
TransferListCardTemp.args = {
  currency: '4,823.00',
  currencyUnit: 'USD',
};
