import { Story, Meta } from '@storybook/react';
import React from 'react';

import SeoForm from '.';

export default {
  title: 'Components/organisms/SeoForm',
  component: SeoForm,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <SeoForm />
);
