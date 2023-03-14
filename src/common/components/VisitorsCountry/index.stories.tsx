import { Story, Meta } from '@storybook/react';
import React from 'react';

import VisitorsCountry from '.';

export default {
  title: 'Components/templates/VisitorsCountry',
  component: VisitorsCountry,
  argTypes: {},
} as Meta;

export const normal: Story = () => (
  <VisitorsCountry
    title="Visitors From Country"
    info={{
      hn: {
        value: 30,
        title: 'Hà Nội'
      },
      dn: {
        value: 20,
        title: 'Đà Nẵng'
      },
      hcm: {
        value: 40,
        title: 'Hồ Chí Minh'
      },
      differ: {
        value: 10,
        title: 'Khác'
      }
    }}
    defaultDate={[]}
  />
);
