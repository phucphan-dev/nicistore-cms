import { Story, Meta } from '@storybook/react';
import React from 'react';

import TopKeyword from '.';

export default {
  title: 'Components/templates/TopKeyword',
  component: TopKeyword,
  argTypes: {},
} as Meta;

const dataDummy = [
  {
    id: 1,
    name: 'báo cáo',
  },
  {
    id: 2,
    name: 'tuyển dụng',
  },
  {
    id: 3,
    name: 'tin tức',
  },
];

export const normal: Story = () => (
  <div style={{ maxWidth: '500px', padding: '30px', background: '#eee' }}>
    <TopKeyword dataList={dataDummy} title="Top Keywords" handleClick={(id) => console.log('id', id)} />
  </div>
);
