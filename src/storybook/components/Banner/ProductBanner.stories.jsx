import ProductBanner from '@common/ui/components/atomic/BannerGroup/ProductBanner';
import React from 'react';
import BearImage from '../../../assets/images/BearHome2.png';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Banner/Product Banner',
  component: ProductBanner
};

const Template = args => (
  <ProductBanner {...args}>
    <img src={BearImage} alt="" />
  </ProductBanner>
);

export const ProductBannerCompact = Template.bind({});
ProductBannerCompact.args = {
  type: 'compact',
  heading: 'Enter the text of the Product nd change the Color',
  label: 'Label'
};

export const ProductBannerDetail = Template.bind({});
ProductBannerDetail.args = {
  type: 'detail',
  heading: 'Product Name',
  description: 'Enter the text of the Products description and change the Color',
  footerLeft: { title: 'Subscription duration', params: '33', unit: 'month' },
  footerRight: { title: 'Maximun Interest rate', params: '44', unit: '%' }
};

export const ProductBannerList = Template.bind({});
ProductBannerList.args = {
  type: 'list',
  heading: 'Product name',
  description: 'Enter the text of the Products description and change the Color',
  footerLeft: { title: '', params: '12 ~ 36', unit: 'month' },
  footerRight: { title: 'Maximun', params: '44', unit: '%' }
};
