import List from '@common/components/atoms/ListGroup/List';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/List/Control List',
  component: List,
};

const Template = args => <List {...args} />;

export const Select = Template.bind({});
Select.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'select', position: 'right' },
};

export const Switch = Template.bind({});
Switch.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'switch', position: 'right' },
};

export const SwitchDisabled = Template.bind({});
SwitchDisabled.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'switch', position: 'right', disabled: true },
};

export const SwitchActive = Template.bind({});
SwitchActive.args = {
  title: 'Title',
  subTitle: 'Sub Title',
  captionSegments: { type: 1, caption1: 'Transaction notifications' },
  control: { name: 'switch', position: 'right', active: true },
};
