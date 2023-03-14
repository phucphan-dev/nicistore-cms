import { Story, Meta } from '@storybook/react';
import React from 'react';

import ImageResizer from '.';

export default {
  title: 'Components/organisms/ImageResizer',
  component: ImageResizer,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ImageResizer />
);
