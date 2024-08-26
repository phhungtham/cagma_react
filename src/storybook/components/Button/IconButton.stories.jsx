import { IconButton } from '@common/components/atoms/ButtonGroup/IconButton/IconButton';

// eslint-disable-next-line
export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Button/IconButton',
  component: IconButton,
};

const IconButtonStory = args => <IconButton {...args} />;

export const Icon = IconButtonStory.bind({});
Icon.args = {
  className: '',
  disable: false,
  label: null,
  onClick: undefined,
  size: 'w-16',
  backgroundBorder: false,
  background: false,
};
export const IconText = IconButtonStory.bind({});
IconText.args = {
  className: '',
  disable: false,
  label: 'Text',
  onClick: undefined,
  size: 'w-16',
  backgroundBorder: false,
  background: false,
};
