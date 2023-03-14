import { Story, Meta } from '@storybook/react';
import { Button, Space } from 'antd';
import React from 'react';

import HeaderPage from '.';

export default {
  title: 'Components/templates/HeaderPage',
  component: HeaderPage,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <div>
    <HeaderPage
      title="Homepage"
      rightHeader={(
        <Space>
          <Button>
            Unpublish
          </Button>
          <Button>
            Save
          </Button>
        </Space>
      )}
    />
  </div>
);
