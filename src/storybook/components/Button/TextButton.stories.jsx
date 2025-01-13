import { TextButton } from '@common/components/atoms/ButtonGroup/TextButton/TextButton';
import { SIZE } from '@common/components/constants';

// eslint-disable-next-line
export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Button/TextButton',
  component: TextButton,
};

const TextButtonStory = args => <TextButton {...args} />;
const TextButtonIconStory = args => <TextButton {...args}> </TextButton>;

export const TextButtonBasic = TextButtonStory.bind({});
TextButtonBasic.args = {
  className: '',
  disable: false,
  label: 'Text Button',
  onClick: undefined,
  variant: 'primary',
  size: SIZE.SMALL,
};

export const TextButtonIcon = TextButtonIconStory.bind({});
TextButtonIcon.args = {
  className: '',
  disable: false,
  label: 'Text Button',
  iconPosition: 'right',
  onClick: undefined,
  variant: 'primary',
  size: SIZE.SMALL,
};
