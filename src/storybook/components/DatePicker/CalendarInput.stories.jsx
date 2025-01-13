import CalendarInput from '@common/components/atoms/Calendar/CalendarInput';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Calendar/CalendarInputBox',
  component: CalendarInput,
};

const CalendarInputTemplate = args => <CalendarInput {...args} />;

export const CalendarInputBox = CalendarInputTemplate.bind({});
CalendarInputBox.args = {
  inputType: 'keyboard',
  disabled: false,
};
