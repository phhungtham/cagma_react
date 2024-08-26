import React from 'react';

import InfoBox from '@common/components/atoms/InfoBox';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/InfoBox/InfoBox',
  component: InfoBox,
};

const Template = args => <InfoBox {...args} />;

export const InformationBox = Template.bind({});
InformationBox.args = {
  variant: 'informative',
  textOnly: false,
  label: 'Enter the Informative message here.',
};
