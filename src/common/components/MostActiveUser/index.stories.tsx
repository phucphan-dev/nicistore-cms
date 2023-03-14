import { Story, Meta } from '@storybook/react';
import React from 'react';

import MostActiveUser from '.';

export default {
  title: 'Components/templates/MostActiveUser',
  component: MostActiveUser,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div style={{ padding: '30px', maxWidth: '580px', background: '#eee' }}>
    <MostActiveUser
      title="Most Active User"
      dataList={[...Array(20)].map((_, idx) => ({
        id: idx + 1,
        avatar: idx % 2 === 0 ? '' : 'https://source.unsplash.com/random',
        name: `Nici Store ${idx + 1}`,
        email: `demo${idx}@gmail.com`
      }))}
      handleClickUser={(id) => console.log(id)}
    />
  </div>
);
