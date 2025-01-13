import DatePicker from '@common/components/atoms/Calendar/DatePicker';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Calendar/DatePickerBox',
  component: DatePicker,
};

const minDate = '2000-04-10';
const maxDate = '2030-06-15';

const DatePickerTemplate = args => <DatePicker {...args} />;

export const DatePickerBox = DatePickerTemplate.bind({});
DatePickerBox.args = {
  minDate,
  maxDate,
};
