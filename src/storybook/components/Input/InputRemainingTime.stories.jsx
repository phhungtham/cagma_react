import Input from '@common/components/atoms/Input/Input';

// eslint-disable-next-line
export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Input/Input Remaining Time',
  component: Input,
};

const Template = args => <Input {...args} />;

export const InputRemainingTime = Template.bind({});
InputRemainingTime.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  remainingTime: {
    minutes: 3,
    seconds: 0,
  },
  helperText: 'Helper Text',
};
