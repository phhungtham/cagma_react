import Input from '@common/components/atoms/Input/Input';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Input/Input Memo',
  component: Input,
};

const Template = args => <Input {...args} />;

export const InputMemo = Template.bind({});
InputMemo.args = {
  label: 'Label',
  placeholder: 'Placeholder',
  helperText: 'Helper Text',
  maxLength: 35,
  isCountCharacter: true,
  isMemo: true,
};
