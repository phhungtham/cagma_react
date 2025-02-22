import Switch from '@common/components/atoms/Switch';
import { action } from '@storybook/addon-actions';
import { DocumentIcon } from 'assets/icons';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Switch/Switch With Icon',
  component: Switch,
};

const Template = args => (
  <Switch
    {...args}
    onChange={action('Active Status')}
  >
    <DocumentIcon />
  </Switch>
);

export const SwitchWithIcon = Template.bind({});
SwitchWithIcon.args = {
  type: 'data',
  positionSelected: 'right',
};

export const SelectedRight = Template.bind({});
SelectedRight.args = {
  type: 'data',
  positionSelected: 'right',
};

export const SelectedLeft = Template.bind({});
SelectedLeft.args = {
  type: 'data',
  positionSelected: 'left',
};
