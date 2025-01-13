import BottomSheet from '@common/components/templates/BottomSheet';

export default {
  title: 'SOL CANADA STORYBOOKS/Atomic Component/Bottom/Bottom Sheet',
  component: BottomSheet,
};

const Template = args => (
  <BottomSheet {...args}>
    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti delectus aliquid, neque culpa laboriosam fugit
    corporis quis unde provident voluptatum optio molestias, ducimus dolorum tempora, odit omnis totam quasi quos Lorem
    ipsum dolor sit amet consectetur adipisicing elit. Corporis, ipsam? Eos temporibus iusto, blanditiis doloribus
    quisquam atque sed quod voluptate quibusdam repudiandae ex distinctio pariatur, consequatur mollitia debitis,
    ducimus rerum molestiae vel eaque? Iusto, voluptatem assumenda. Fugit ex veritatis architecto deleniti a, itaque
    eaque nam quasi laudantium reprehenderit animi quia! unde provident voluptatum optio molestias, ducimus dolorum
    tempora, odit omnis totam quasi quos Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, ipsam? Eos
    temporibus iusto, blanditiis doloribus quisquam atque sed quod voluptate quibusdam repudiandae ex distinctio
    pariatur, consequatur mollitia debitis, ducimus rerum molestiae vel eaque? Iusto, voluptatem assume unde provident
    voluptatum optio molestias, ducimus dolorum tempora, odit omnis totam quasi quos Lorem ipsum dolor sit amet
    consectetur adipisicing elit. Corporis, ipsam?erum molestiae vel eaque? Iusto, voluptatem assumenda. Fugit ex
    veritatis architecto deleniti a, itaque eaque nam quasi laudantium reprehenderit animi quia! unde provident
    voluptatum optio molestias, ducimus dolorum tempora, odit omnis totam quasi quos Lorem ipsum dolor sit amet
    consectetur adipisicing elit. Corporis, ipsam? Eos temporibus iusto, blanditiis doloribus quisquam atque sed quod
    voluptate quibusdam repudiandae ex distinctio pariatur, consequatur mollitia debitis, ducimus rerum molestiae vel
    eaque? Iusto, voluptatem assume unde provident voluptatum optio molestias, ducimus dolorum tempora, odit omnis totam
    quasi quos Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis, ipsam? Eos temporibus iusto,
    blanditiis doloribus quisquam atque sed quod voluptate quibusdam repudiandae ex distinctio pariatur, consequatur
    mollitia debitis, ducimus rerum molestiae vel eaque? Iusto, voluptatem assume
  </BottomSheet>
);

export const Middle = Template.bind({});
Middle.args = {
  type: 'middle',
  open: false,
};
export const Max = Template.bind({});
Max.args = {
  type: 'max',
  open: false,
};
export const MaxScroll = Template.bind({});
MaxScroll.args = {
  type: 'max-scroll',
  open: false,
  dockerBar: true,
};
export const Pulled90 = Template.bind({});
Pulled90.args = {
  type: 'pulled-90',
  open: false,
  title: 'title',
};
