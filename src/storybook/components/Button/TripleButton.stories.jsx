import React from 'react';

import { TripleButton } from '@atomic/ButtonGroup/TripleButton/TripleButton';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Button/TripleButton',
  component: TripleButton
};

const TripleButtonStory = args => <TripleButton {...args} />;

export const Triple = TripleButtonStory.bind({});
Triple.args = {
  firstButton: {
    onClick: undefined,
    label: 'Button',
    disable: false
  },
  secondButton: {
    onClick: undefined,
    label: 'Button',
    disable: false
  },
  thirdButton: {
    onClick: undefined,
    label: 'Button',
    disable: false
  }
};
