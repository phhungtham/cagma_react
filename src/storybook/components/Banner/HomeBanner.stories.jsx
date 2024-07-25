import HomeBanner from '@common/ui/components/atomic/BannerGroup/HomeBanner';
import React from 'react';
import BearImage from '../../../assets/images/BearHome2.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Banner/Home Banner',
  component: HomeBanner
};

const Template = args => <HomeBanner {...args} />;

export const Home = Template.bind({});
Home.args = {
  heading: 'Sihnah Bank Golden Tiger',
  description: 'Open an savings account with a preferential  interest rate for the new year rate for the new year ',
  thumbnail: BearImage
};
