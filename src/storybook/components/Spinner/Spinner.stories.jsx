import Spinner from '@common/components/atoms/Spinner';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Spinner/Spinner',
  component: Spinner,
};

const Template = args => <Spinner {...args} />;

export const SpinnerLoading = Template.bind({});
SpinnerLoading.args = {};
