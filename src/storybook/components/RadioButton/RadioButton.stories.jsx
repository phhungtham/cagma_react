import RadioButton from '@common/components/atoms/RadioButton';
import { SIZE } from '@common/components/constants';
import { action } from '@storybook/addon-actions';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Radio/Radio Button',
  component: RadioButton,
};

const Template = args => (
  <>
    <RadioButton
      {...args}
      onChange={action('Checked')}
    />{' '}
    <br />
    <RadioButton
      {...args}
      onChange={action('Checked')}
    />
  </>
);

export const Selected = Template.bind({});
Selected.args = {
  size: SIZE.SMALL,
};

export const Disabled = Template.bind({});
Disabled.args = {
  size: SIZE.SMALL,
  selected: true,
  disabled: true,
};
