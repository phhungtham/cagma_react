import Accoridan from '@common/components/atoms/Accoridan';
import { AnswerIcon, QuestionIcon } from 'assets/icons';
import React from 'react';

export default {
  title: 'SOL CAMBODIA STORYBOOKS/Atomic Component/Accoridan/Accoridan',
  component: Accoridan
};

const AccoridanStories = args => <Accoridan {...args} />;

export const TextOnly = AccoridanStories.bind({});
TextOnly.args = {
  label: 'Label',
  title: 'Cannot set property wmatrix of which has only a getter',
  panelData: {
    text: 'Enter at least 2 lines of title. Enter at least 2  lines of title.'
  },
  captionSegments: { type: 2, caption1: 'Caption1', caption2: 'Caption2' }
};

export const WithIcon = AccoridanStories.bind({});
WithIcon.args = {
  title: 'Cannot set property wmatrix of which has only a getter',
  panelData: {
    text: 'Enter at least 2 lines of title. Enter at least 2  lines of title.',
    icon: AnswerIcon
  },
  titleIcon: { name: QuestionIcon, position: 'left' }
};

export const WithButton = AccoridanStories.bind({});
WithButton.args = {
  label: 'Label',
  title: 'Cannot set property wmatrix of which has only a getter',
  panelData: {
    dataTable: [
      { label: 'Label', text: 'Cannot set property wmatrix' },
      { label: 'Label', text: 'Cannot set property wmatrix' },
      { label: 'Label', text: 'Cannot set property wmatrix' }
    ]
  },
  titleIcon: { name: QuestionIcon, position: 'left' },
  button: 'Button'
};

export const DataTable = AccoridanStories.bind({});
DataTable.args = {
  label: 'Label',
  title: 'Cannot set property wmatrix of which has only a getter',
  panelData: {
    dataTable: [
      { label: 'Label', text: 'Cannot set property wmatrix' },
      { label: 'Label', text: 'Cannot set property wmatrix' },
      { label: 'Label', text: 'Cannot set property wmatrix' }
    ]
  }
};
export const ViewDetail = AccoridanStories.bind({});
ViewDetail.args = {
  title: 'View Detail',
  viewDetail: true,
  panelData: {
    dataDetail: [
      {
        title: 'Branch Information',
        detailItems: [
          {
            label: 'Withdrawal account',
            content: 'Shinhan Bank 1234567891012'
          },
          {
            label: 'Total deposit amount',
            content: '1,200 USD'
          },
          {
            label: 'Balance after withdrawal',
            content: '2,400,000 USD'
          }
        ]
      },
      {
        title: 'Branch Information',
        detailItems: [
          {
            label: 'Office',
            content: 'Hochiminh Branch'
          },
          {
            label: 'Address',
            content: '11th Floor, Centec Tower, 72-72 Nguyen Thi Minh Khai, Distric 3, HC'
          },
          {
            label: 'Contact',
            content: '028.3823.8302'
          }
        ]
      }
    ]
  }
};
