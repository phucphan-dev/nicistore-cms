import { Story, Meta } from '@storybook/react';
import React from 'react';

import QuickActionCard from './QuickActionCard';

import QuickAction from '.';

export default {
  title: 'Components/templates/QuickAction',
  component: QuickAction,
  argTypes: {},
} as Meta;

export const cardOnly: Story = () => (
  <div style={{ padding: '30px', maxWidth: '500px' }}>
    <QuickActionCard
      thumbnail="https://source.unsplash.com/random"
      alt="image"
      postStatusList={[
        {
          status: 1,
          amount: 10
        },
        {
          status: 7,
          amount: 1,
        },
        {
          status: 13,
          amount: 100
        }
      ]}
      productivityPerCent={65}
    />
  </div>
);

export const normal: Story = () => (
  <div style={{ padding: '30px', maxWidth: '580px', background: '#eee' }}>
    <QuickAction
      title="Quick action"
      dataList={new Array(3).fill({
        thumbnail: 'https://source.unsplash.com/random',
        alt: 'image',
        postStatusList:
          [
            {
              status: 1,
              amount: 10
            },
            {
              status: 7,
              amount: 1,
            },
            {
              status: 13,
              amount: 100,
            }
          ],
        productivityPerCent: 65
      })}
    />
  </div>
);
