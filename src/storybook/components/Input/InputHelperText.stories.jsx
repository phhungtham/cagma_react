import React from 'react';

import Input from '@common/components/atoms/Input/Input';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/Helper Text',
  component: Input,
};

const Template = args => <Input {...args} />;

export const HelperText = Template.bind({});
HelperText.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
};
