import { Story, Meta } from '@storybook/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import ActivityLogs from '.';

export default {
  title: 'Components/templates/ActivityLogs',
  component: ActivityLogs,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ padding: '30px' }}>
    <BrowserRouter>
      <ActivityLogs
        title="Hoat dong"
        dataList={new Array(6).fill({
          thumbnail: 'https://source.unsplash.com/random',
          alt: 'image',
          activeTime: '11:34',
          activeLogsList: ['Bình luận mới', 'Sản phẩm'],
          desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra porttitor morbi egestas faucibus rhoncus, pellentesque nibh nulla vehicula. Risus ut id sit et. Placerat augue dictumst mattis lacus sed ipsum mi consequat augue. Enim sed vitae vitae sit.',
        })}
      />
    </BrowserRouter>
  </div>
);
