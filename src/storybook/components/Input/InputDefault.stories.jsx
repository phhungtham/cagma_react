import React from 'react';

import Input from '@common/components/atoms/Input/Input';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/Default',
  component: Input,
};

const Template = args => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  placeholder: 'Placeholder',
};

export const TextFieldError = Template.bind({});
TextFieldError.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  errorMessage: 'Error Message',
};
