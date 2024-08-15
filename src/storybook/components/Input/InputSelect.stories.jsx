import React from 'react';

import InputSelect from '@common/components/atoms/Input/InputSelect';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/InputSelect',
  component: InputSelect
};

const Template = args => <InputSelect {...args} />;

export const InputTextSelect = Template.bind({});
InputTextSelect.args = {
  label: 'Label',
  placeholder: 'Placeholder'
};

export const InputSelectError = Template.bind({});
InputSelectError.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  errorMessage: 'Error Message'
};
