import React from 'react';

import CalendarInput from '@common/components/molecules/Calendar/CalendarInput';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Calendar/CalendarInputBox',
  component: CalendarInput,
};

const CalendarInputTemplate = args => <CalendarInput {...args} />;

export const CalendarInputBox = CalendarInputTemplate.bind({});
CalendarInputBox.args = {
  inputType: 'keyboard',
  disabled: false,
};
