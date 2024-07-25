import Banner from '@common/ui/components/atomic/BannerGroup/Banner';
import React from 'react';
import BearImage from '../../../assets/images/BearHome2.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Banner/Banner',
  component: Banner
};

const Template = args => (
  <Banner {...args}>
    <img src={BearImage} alt="" />
  </Banner>
);

export const NormalBanner = Template.bind({});
NormalBanner.args = {
  heading: 'Sihnah Barihnah Bankiger',
  description: 'Open an savings account with a preferer'
};
