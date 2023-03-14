import { Story, Meta } from '@storybook/react';
import React from 'react';

import UnAuthLayout from '.';

export default {
  title: 'Components/templates/UnAuthLayout',
  component: UnAuthLayout,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <UnAuthLayout />
);
