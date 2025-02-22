import Popover from '@common/components/atoms/Popover';
import { CheckIcon } from 'assets/icons';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Popover/Popover Multiple Line',
  component: Popover,
};

const Template = args => (
  <Popover {...args}>
    <CheckIcon />
  </Popover>
);

export const PopoverLight = Template.bind({});
PopoverLight.args = {
  lineOfText: 'multiple',
  message: 'Complete to hide the account Complete to hide the account. Thank you.',
  mode: 'light',
};
export const PopoverDark = Template.bind({});
PopoverDark.args = {
  lineOfText: 'multiple',
  message: 'Complete to hide the account Complete to hide the account. Thank you.',
  mode: 'dark',
};
export const PopoverWithButton = Template.bind({});
PopoverWithButton.args = {
  lineOfText: 'multiple',
  message: 'Complete to hide the account Complete to hide the account. Thank you.',
  mode: 'light',
  buttonLabel: 'Button',
};
