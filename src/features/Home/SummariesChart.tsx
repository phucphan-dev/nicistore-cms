import {
  Card, Col, DatePicker, Row, Select, Space, Typography
} from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LineChart from './LineChart';

import { formatDateYYYYMMDD } from 'common/utils/functions';

const { RangePicker } = DatePicker;
const gutterValue = 16;
const dateFormat = 'YYYY-MM-DD';

interface SummariesChartProps {
  dataFilter: OptionType[];
  chartData: {
    sessionsData?: any;
    activeUsers?: any;
  }
  isLoading?: boolean;
  defaultDate: string[];
  onChange?: (val: OptionType) => void;
  handleChangeRange?: (val: string[]) => void;
}

const SummariesChart: React.FC<SummariesChartProps> = ({
  dataFilter, chartData, isLoading = false, defaultDate, onChange, handleChangeRange
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<OptionType | undefined>(dataFilter[0]);

  return (
    <Card title={(
      <Typography.Title level={2}>
        {t('dashboard.gaSummary')}
      </Typography.Title>
    )}
    >
      <Space direction="vertical" size={gutterValue} style={{ width: '100%' }}>
        {/* Filter  */}
        <Row gutter={[gutterValue, gutterValue]}>
          <Col span={20}>
            <RangePicker
              defaultValue={[moment(defaultDate[0], dateFormat),
              moment(defaultDate[1], dateFormat)]}
              onChange={(val) => {
                if (!val) return;
                const res = val.map((item) => (formatDateYYYYMMDD(item)));
                if (handleChangeRange) handleChangeRange(res);
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              size="middle"
              defaultValue={dataFilter[0]}
              style={{ maxWidth: '124px', width: '100%' }}
              placeholder={t('system.all')}
              onChange={(e) => {
                setValue(e);
                if (onChange) onChange(e);
              }}
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

          </Col>

        </Row>
        <Row gutter={[gutterValue, gutterValue]}>
          <Col span={12}>
            <Card
              type="inner"
            >
              <LineChart
                dataConfig={chartData.sessionsData}
                title={t('dashboard.gaSessions')}
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card
              type="inner"
            >
              <LineChart
                dataConfig={chartData.activeUsers}
                title={t('dashboard.gaActiveUser')}
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>
      </Space>
    </Card>
  );
};

export default SummariesChart;
