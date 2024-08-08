import React from 'react';

import { Button } from '@atomic/ButtonGroup/Button/Button';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Button/OneButton',
  component: Button
};

const BasicButton = args => <Button {...args} />;
const IconButton = args => <Button {...args}> </Button>;

export const Basic = BasicButton.bind({});
Basic.args = {
  variant: 'filled__primary',
  label: 'Button',
  disable: false
};

export const ButtonIcon = IconButton.bind({});
ButtonIcon.args = {
  variant: 'filled__primary',
  label: 'Button',
  disable: false,
  iconPosition: 'right'
};

// export const ButtonDisable = Template.bind({});
// ButtonDisable.args = {
//   variant: 'outlined',
//   label: 'Button'
// };
