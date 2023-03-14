import { Story, Meta } from '@storybook/react';
import React from 'react';

import DeviceCircle, { DeviceData } from './DeviceCircle';

import SectionByDevice from '.';

export default {
  title: 'Components/templates/SectionByDevice',
  component: SectionByDevice,
  argTypes: {},
} as Meta;

const desktop: DeviceData = {
  percent: 60,
  amount: 100,
};
const tablet: DeviceData = {
  percent: 30,
  amount: 1200,
};
const mobile: DeviceData = {
  percent: 10,
  amount: 800,
};

const dataList = {
  desktop,
  tablet,
  mobile,
};

export const circleList: Story = () => (
  <div style={{ maxWidth: '500px' }}>
    <DeviceCircle
      deviceData={dataList}
    />
  </div>
);

export const Normal: Story = () => (
  <div style={{ padding: '30px', maxWidth: '560px', background: '#eee' }}>
    <SectionByDevice
      title="Session By Device"
      deviceData={dataList}
      defaultDate={[]}
    />
  </div>
);
