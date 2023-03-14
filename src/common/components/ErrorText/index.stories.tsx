import { Story, Meta } from '@storybook/react';
import React from 'react';

import ErrorText from '.';

export default {
  title: 'Components/atoms/ErrorText',
  component: ErrorText,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <ErrorText />
);
