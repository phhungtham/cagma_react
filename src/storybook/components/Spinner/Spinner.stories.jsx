import Spinner from '@common/ui/components/atomic/Spinner';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Spinner/Spinner',
  component: Spinner
};

const Template = args => <Spinner {...args} />;

export const SpinnerLoading = Template.bind({});
SpinnerLoading.args = {};
