import {
  Select,
  Typography,
  Divider,
} from 'antd';
import React, { useState } from 'react';

import {
  doughnutOptions,
  doughnutData,
} from 'common/assets/dummyData/chart';
import ChartCustom from 'common/components/Chart';

interface DoughnutProps {
  title: string;
  dataFilter: OptionType[];
}

const DoughnutChart: React.FC<DoughnutProps> = ({
  dataFilter,
  title,
}) => {
  const [value, setValue] = useState<OptionType | undefined>(undefined);
  return (
    <div className="p-home_chart">
      <div className="p-home_filter">
        <Typography.Title level={3}>{title}</Typography.Title>
        <div className="p-home_filter_select">
          <Typography.Text>Lọc: </Typography.Text>
          <div className="p-home_filter_select-wrapper">
            <Select
              className="u-mt-8"
              size="large"
              style={{ maxWidth: '124px', width: '100%' }}
              placeholder="Tất cả"
              onChange={setValue}
              value={value}
            >
              {
                dataFilter.map((val, idx) => (
                  <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                    {val.label}
                  </Select.Option>
                ))
              }
            </Select>
          </div>
        </div>
      </div>
      <Divider type="horizontal" />
      <ChartCustom
        type="doughnut"
        data={doughnutData}
        options={doughnutOptions}
        legendCustomId="doughnut-legend-container"
        width={220}
        height={220}
      />
    </div>
  );
};
export default DoughnutChart;
