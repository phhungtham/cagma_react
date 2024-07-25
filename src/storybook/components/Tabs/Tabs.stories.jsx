import Notification from '@common/ui/components/atomic/Notification';
import Tabs from '@common/ui/components/atomic/Tabs';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Tabs/Tab',
  component: Tabs
};

const Template = args => (
  <Tabs {...args}>
    <Notification
      notifyContent="Deposit of USD 100,000.00 from Maria(*8888) to *1234"
      thumbnail=""
      time="27.03.2022 13:05"
    />
  </Tabs>
);

export const Tab = Template.bind({});
Tab.args = {
  tabList: [{ title: 'Checking' }, { title: 'Benefits' }]
};
