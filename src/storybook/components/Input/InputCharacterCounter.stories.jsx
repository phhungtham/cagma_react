import React from 'react';

import Input from '@common/components/atoms/Input/Input';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/Input Character Counter',
  component: Input,
};

const Template = args => <Input {...args} />;

export const InputCharacterCounter = Template.bind({});
InputCharacterCounter.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  maxLength: 35,
  isCountCharacter: true,
};
