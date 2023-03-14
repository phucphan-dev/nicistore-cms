import {
  Select,
  Typography,
  Divider,
  DatePicker,
  Spin,
  Empty,
} from 'antd';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import {
  barOptions,
} from 'common/assets/dummyData/chart';
import ChartCustom from 'common/components/Chart';
import { getGaVisitorTrackingService } from 'common/services/dashboard';
import { dateRangeFromTo, formatDateYYYYMMDD } from 'common/utils/functions';

const { RangePicker } = DatePicker;

interface BarChartProps {
  title: string;
  dataFilter?: OptionType[];
}

const dateFormat = 'YYYY-MM-DD';
const defaultDateValue = [moment(new Date()).subtract(1, 'months').format(dateFormat), moment(new Date()).format(dateFormat)];

const BarChart: React.FC<BarChartProps> = ({
  dataFilter,
  title,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<OptionType | undefined>(undefined);
  const [dateRange, setDateRange] = useState(defaultDateValue);

  const { data, isFetching, isLoading } = useQuery(
    ['getGaVisitorTrackingService', dateRange],
    () => getGaVisitorTrackingService({
      from: dateRange[0],
      to: dateRange[1],
    }),
    { enabled: dateRange.length === 2 }
  );

  const newData = useMemo(() => {
    if (!data || !data.length) {
      return undefined;
    }
    return {
      labels: dateRangeFromTo(data[0].date, data[data.length - 1].date, 'DD/MM'),
      datasets: [
        {
          type: 'bar',
          data: data.map((ele) => ele.activeUsers),
          backgroundColor: '#4D89FF',
          maxBarThickness: 10,
          borderRadius: 3,
          label: t('dashboard.gaActiveUser'),
          order: 3,
        },
        {
          type: 'bar',
          data: data.map((ele) => ele.newUsers),
          backgroundColor: '#6CDBBA',
          maxBarThickness: 10,
          borderRadius: 3,
          label: t('dashboard.newUser'),
          order: 2,
        },
        {
          type: 'line',
          label: t('dashboard.gaSessions'),
          data: data.map((ele) => ele.sessions),
          fill: false,
          backgroundColor: '#ff4d4f',
          borderColor: '#ff4d4f',
          pointHoverRadius: 5,
          pointRadius: 1,
          lineTension: 0.3,
          order: 1,
        },
      ]
    };
  }, [data, t]);

  return (
    <div className="p-home_chart">
      <div className="p-home_filter">
        <div className="p-home_filter-heading">
          <Typography.Title level={3}>{title}</Typography.Title>
          {dataFilter && (
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
                    dataFilter?.map((val, idx) => (
                      <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                        {val.label}
                      </Select.Option>
                    ))
                  }
                </Select>
              </div>
            </div>
          )}
        </div>
        <div className="p-home_filter-datePicker">
          <RangePicker
            defaultValue={[moment(dateRange[0], dateFormat),
            moment(dateRange[1], dateFormat)]}
            onChange={(val) => {
              if (!val) return;
              const res = val.map((item) => (formatDateYYYYMMDD(item)));
              setDateRange(res);
            }}
            style={{ width: '100%' }}
          />
        </div>

      </div>
      <Divider type="horizontal" />
      <Spin size="large" spinning={isFetching || isLoading}>
        {newData
          ? (
            <ChartCustom
              type="bar"
              data={newData}
              options={barOptions}
              height={287}
              legendCustomId="legend-container"
            />
          ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </Spin>
    </div>
  );
};

export default BarChart;
