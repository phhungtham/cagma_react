import React from 'react';
import BearImage from '../../../assets/images/bear-profile.png';
import TransferList from '@common/ui/components/atomic/ListGroup/TransferList';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/List/Transfer List',
  component: TransferList
};

const Template = args => <TransferList {...args} />;

export const TransferListStories = Template.bind({});
TransferListStories.args = {
  text: 'Text show bottom sheet',
  border: true,
  thumbnail: BearImage
};
