import { Story, Meta } from '@storybook/react';
import React from 'react';

import Sidebar from '.';

export default {
  title: 'Components/organisms/Sidebar',
  component: Sidebar,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Sidebar menuItems={[]} />
);
