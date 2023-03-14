import { Story, Meta } from '@storybook/react';
import React from 'react';

import ChartCustom from '.';

/**
 * Noted:
 * - Responsive fontsize by hands: `font objects`
 */

export default {
  title: 'Components/organisms/Chart',
  component: ChartCustom,
  argTypes: {
  },
} as Meta;
const dataConfig = {
  labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 8, 34, 2, 3, 7, 9, 34, 12, 4],
      fill: false,
      backgroundColor: '#8BC441',
      borderColor: '#8BC441',
      pointHoverRadius: 5,
      pointRadius: 1,
    },
  ],
};
// OPTIONS CONFIGURATION
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
    },
  },
  scales: {
    scaleId: {
      ticks: {
        display: false,
      },
      title: {
        display: true,
      },
      grid: {
        borderDash: [2, 4],
        color: '#595959',
        borderColor: '#ffffff', // change color follow by theme
        drawTicks: false,
        label: {
          display: false,
        },
      },
    },
    x: {
      grid: {
        borderColor: '#595959',
        display: false,
      },
    },
    y: {
      // position: 'right',
      grid: {
        borderColor: '#ffffff', // change color follow by theme
        display: false,
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    htmlLegend: {
      // ID of the container to put the legend in
      containerID: 'doughnut-legend-container',
    },
    legend: {
      display: false,
    },
    datalabels: {
      display: false,
    },
  },
};
const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  title: {
    display: true,
    text: 'Statistical results chart',
    fontSize: 50,
    fontColor: '#195d76',
    fontStyle: 'bold',
    padding: 32,
  },
  plugins: {
    legend: {
      display: false,
    },
    datalabels: {
      display: true,
      color: 'transparent',
      padding: {
        right: 2,
      },
      labels: {
        title: {
          font: {
            weight: 'bold',
            size: 15,
          },
          color: '#ffffff',
          rotation: -90,
        },
      },
    },
  },
  scales: {
    scaleId: {
      ticks: {
        display: false,
      },
      title: {
        display: true,
      },
      grid: {
        borderDash: [2, 4],
        color: '#595959',
        borderColor: '#ffffff', // change color follow by theme
        drawTicks: false,
        label: {
          display: false,
        },
      },
    },
    x: {
      grid: {
        borderColor: '#595959',
        display: false,
      },
      ticks: {
        // callback(value:any) {
        //   return `$${value}`;
        // },
        color: '#8C8C8C',
        font: {
          weight: 700,
          size: 16,
        },
      },
    },
    y: {
      grid: {
        borderColor: '#ffffff', // change color follow by theme
        display: false,
      },
      ticks: {
        callback(value: any) {
          return `${value},00`;
        },
        color: '#8C8C8C',
        font: {
          weight: 700,
          size: 16,
        },
      },
    },
  },
};

// DATA CONFIGURATION
const barData = {
  labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
  datasets: [
    {
      data: [200, 500, 1500, 800, 1200, 3000, 2800],
      backgroundColor: '#8BC441',
      barThickness: 32,
      borderRadius: 8,
      label: 'USD',
    },
  ],
};
const doughnutData = {
  labels: [
    'Dummy 1',
    'Dummy 2',
    'Dummy 3',
    'Dummy 4',
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [25556, 2000, 10000, 8000],
    backgroundColor: [
      '#9BDB48',
      '#FF4D4F',
      '#FCBD3F',
      '#4D9BF7',
    ],
    hoverOffset: 2,
  }],
};

export const LineChart: Story = () => (
  <div>
    <ChartCustom
      type="line"
      data={dataConfig}
      options={options}
    />
  </div>
);
export const BarChart: Story = () => (
  <div>
    <ChartCustom
      type="bar"
      data={barData}
      options={barOptions}
    />
  </div>
);

export const DoughnutChart: Story = () => (
  <div style={{ maxWidth: '800px', margin: 'auto' }}>
    <ChartCustom
      type="doughnut"
      data={doughnutData}
      options={doughnutOptions}
      legendCustomId="doughnut-legend-container"
    />
  </div>
);
