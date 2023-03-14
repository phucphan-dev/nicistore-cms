import { Story, Meta } from '@storybook/react';
import React from 'react';

import SelectFile from '.';

export default {
  title: 'Components/organism/SelectFile',
  component: SelectFile,
  argTypes: {
    title: {
      control: {
        type: 'text',
      },
      defaultValue: 'Hình Ảnh',
    },
    isRequired: {
      control: {
        type: 'boolean',
      },
      defaultValue: true,
    },
  },
} as Meta;

export const Normal: Story = ({
  title,
  isRequired,
}) => (
  <div>
    <SelectFile
      title={title}
      isRequired={isRequired}
      value="https://source.unsplash.com/random"
      handleDelete={() => console.log('delete')}
    />
  </div>
);
