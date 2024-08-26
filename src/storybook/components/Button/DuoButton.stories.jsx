import React from 'react';

import { DuoButton } from '@atomic/ButtonGroup/DuoButton/DuoButton';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Button/DuoButton',
  component: DuoButton,
};

const DuoButtonStory = args => <DuoButton {...args} />;

export const Horizontal = DuoButtonStory.bind({});
Horizontal.args = {
  ratio: 'ott',
  firstButton: {
    onClick: undefined,
    label: 'Button',
    disable: false,
  },
  secondButton: {
    onClick: undefined,
    label: 'Button',
    disable: false,
  },
};

export const Vertical = DuoButtonStory.bind({});
Vertical.args = {
  duoDirection: 'vertical',
  firstButton: {
    onClick: undefined,
    label: 'Button',
    disable: false,
  },
  secondButton: {
    onClick: undefined,
    label: 'Button',
    disable: false,
  },
};

// export const ButtonDisable = Template.bind({});
// ButtonDisable.args = {
//   variant: 'outlined',
//   label: 'Button'
// };
