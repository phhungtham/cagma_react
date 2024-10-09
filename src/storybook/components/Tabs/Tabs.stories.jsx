import Tabs from '@common/components/atoms/Tabs';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Tabs/Tab',
  component: Tabs,
};

const Template = args => <Tabs {...args} />;

export const Tab = Template.bind({});
Tab.args = {
  tabList: [{ title: 'Checking' }, { title: 'Benefits' }],
};
