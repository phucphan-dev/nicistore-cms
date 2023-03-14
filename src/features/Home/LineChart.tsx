import {
  Divider, Spin, Typography
} from 'antd';
import React from 'react';

import ChartCustom from 'common/components/Chart';

interface LineChartProps {
  title: string;
  dataConfig?: any;
  loading?: boolean;
}

export const options = {
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
      ticks: {
        display: false
      },
      grid: {
        borderColor: '#595959',
        display: false,
      },
    },
    y: {
      ticks: {
        display: false
      },
      grid: {
        borderColor: '#ffffff', // change color follow by theme
        display: false,
      },
    },
  },
};

const LineChart: React.FC<LineChartProps> = ({
  title,
  dataConfig,
  loading = false
}) => (
  <div className="p-home_chart">
    <div className="p-home_filter">
      <Typography.Title level={3}>{title}</Typography.Title>
    </div>
    <Divider type="horizontal" />
    <Spin spinning={loading}>
      {
        dataConfig
          ? (
            <ChartCustom
              type="line"
              data={dataConfig}
              options={options}
            />
          )
          : (
            <Typography.Text>
              Empty
            </Typography.Text>
          )
      }
    </Spin>

  </div>
);

export default LineChart;
