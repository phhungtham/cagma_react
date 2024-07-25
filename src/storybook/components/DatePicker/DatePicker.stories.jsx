import React from 'react';
import DatePicker from '@common/ui/components/atomic/Calendar/DatePicker';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Calendar/DatePickerBox',
  component: DatePicker
};

const minDate = '2000-04-10';
const maxDate = '2030-06-15';

const DatePickerTemplate = args => <DatePicker {...args} />;

export const DatePickerBox = DatePickerTemplate.bind({});
DatePickerBox.args = {
  minDate,
  maxDate
};
