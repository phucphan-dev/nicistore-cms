import { Story, Meta } from '@storybook/react';
import React from 'react';

import Mainlayout from '.';

import menuSidebar from 'configs/sidebar';

export default {
  title: 'Components/templates/Mainlayout',
  component: Mainlayout,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <Mainlayout menus={menuSidebar} />
);
