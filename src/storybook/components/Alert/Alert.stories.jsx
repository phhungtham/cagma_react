import Alert from '@common/components/atoms/Alert';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Alert/Alert',
  component: Alert,
};

const AlertTemp = args => <Alert {...args} />;

export const AlertStory = AlertTemp.bind({});
AlertStory.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  caption: 'Caption',
  isShowAlert: false,
  isCloseButton: false,
  alertIcon: null,
  firstButton: null,
  secondButton: null,
};
