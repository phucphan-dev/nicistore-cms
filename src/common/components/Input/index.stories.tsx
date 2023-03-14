import { Story, Meta } from '@storybook/react';
import React, { useState } from 'react';

import Input from '.';

export default {
  title: 'Components/atoms/Input',
  component: Input,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['email', 'text', 'number'],
      },
      defaultValue: 'text',
    },
    modifiers: {
      control: {
        type: 'select',
        options: ['default', 'bottomBorder'],
      },
      defaultValue: 'text',
    },
    placeholder: {
      control: {
        type: 'text',
      },
      defaultValue: 'Your Name',
    },
    error: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
      defaultValue: 'Your Name',
    },
    isSearch: {
      control: {
        type: 'boolean',
      },
    },
  },
} as Meta;

export const Normal: Story = ({
  type,
  placeholder,
  error,
  modifiers,
  isSearch,
}) => {
  const [value, setValue] = useState('');

  const handleSetValue = (e: any) => {
    setValue(e.target.value);
  };

  return (
    <Input
      id="name"
      type={type}
      value={value}
      placeholder={placeholder || 'Placeholder'}
      error={error}
      modifiers={modifiers}
      onChange={handleSetValue}
      isSearch={isSearch}
    />
  );
};
