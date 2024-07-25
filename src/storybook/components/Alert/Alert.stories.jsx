import Alert from '@common/ui/components/atomic/Alert/Alert';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Alert/Alert',
  component: Alert
};

const AlertTemp = args => <Alert {...args} />;

export const AlertStory = AlertTemp.bind({});
AlertStory.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  caption: 'Caption',
  isShowAlert: false,
  isCloseButton: true,
  alertIcon: null,
  firstButton: null,
  secondButton: null
};
