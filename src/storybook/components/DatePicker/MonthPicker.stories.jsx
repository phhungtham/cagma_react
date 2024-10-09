import MonthPicker from '@common/components/atoms/Calendar/MonthPicker';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Calendar/MonthPickerBox',
  component: MonthPicker,
};

const MonthPickerTemplate = args => <MonthPicker {...args} />;

export const MonthPickerBox = MonthPickerTemplate.bind({});
MonthPickerBox.args = {
  calendarDirection: 'horizon',
};
