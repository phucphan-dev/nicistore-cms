import { Story, Meta } from '@storybook/react';
import React from 'react';

import Icon, { iconList, IconName } from '.';

export default {
  title: 'Components/atoms/Icon',
  component: Icon,
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['16', '20', '24', '28'],
      },
      defaultValue: '16',
    },
  },
} as Meta;

const listIcon = Object.keys(iconList).map((item) => item as IconName);

export const normal: Story = ({ size }) => (
  <div style={{
    backgroundColor: '#ddd',
    padding: 10,
    display: 'flex',
    flexWrap: 'wrap',
  }}
  >
    {listIcon.map((item) => (
      <div style={{ marginLeft: 5 }}>
        <Icon size={size} iconName={item} />
      </div>
    ))}
  </div>
);
