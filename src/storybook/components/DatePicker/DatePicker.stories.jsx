import DatePicker from '@common/components/molecules/Calendar/DatePicker';
import React from 'react';

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
