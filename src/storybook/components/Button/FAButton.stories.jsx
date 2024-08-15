import { FAButton } from '@common/components/atoms/ButtonGroup/FAB/FAButton';
import React from 'react';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Button/FAButton',
  component: FAButton
};

const FAButtonStory = args => <FAButton {...args} > </FAButton>;
const FAExpandButtonStory = args => <FAButton {...args} > </FAButton>;

export const ScrollButton = FAButtonStory.bind({});
ScrollButton.args = {
  className: '',
  label: 'Text',
  onClick: () => {
    return;
  },
  variant: 'scroll'
};

export const ExpandButton = FAExpandButtonStory.bind({});
ExpandButton.args = {
  className: '',
  label: 'Text',
  onClick: () => {
    return;
  },
  variant: 'expand'
};