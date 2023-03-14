import { Story, Meta } from '@storybook/react';
import React from 'react';

import Image from '.';

export default {
  title: 'Components/atoms/Image',
  component: Image,
  argTypes: {
    ratio: {
      control: {
        type: 'select',
        options: [
          '1x1',
          '3x2',
          '4x3',
          '16x9',
          'logo',
        ],
      },
      defaultValue: 'logo',
    },
    image: {
      control: {
        type: 'text',
      },
      defaultValue: 'https://source.unsplash.com/random',
    },
  },
} as Meta;

export const normal: Story = ({ ratio, image }) => (
  <div style={{
    maxWidth: 600,
    padding: 30,
  }}
  >
    <Image ratio={ratio} src={image} />
  </div>
);
