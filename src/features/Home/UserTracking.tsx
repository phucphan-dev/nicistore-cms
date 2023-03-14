import {
  Card, Col, DatePicker, Row, Space, Spin, Table, Typography
} from 'antd';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { summarizeByCategory } from './helpers';

import { doughnutOptions } from 'common/assets/dummyData/chart';
import ChartCustom from 'common/components/Chart';
import { GaUsersTracking } from 'common/services/dashboard/types';
import { formatDateYYYYMMDD } from 'common/utils/functions';

interface UserTrackingProps {
  data?: GaUsersTracking[];
  defaultDate: string[];
  loading?: boolean;
  handleChangeRange?: (val: string[]) => void;
}
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

const defaultColumns = [
  {
    title: 'Users Active',
    dataIndex: 'activeUsers',
    key: 'activeUsers'
  },
  {
    title: 'New Users',
    dataIndex: 'newUsers',
    key: 'newUsers'
  },
];

const UserTracking: React.FC<UserTrackingProps> = ({
  data,
  defaultDate, loading = false, handleChangeRange
}) => {
  const { t } = useTranslation();
  const dataByBrowser = summarizeByCategory('browser', data);
  const dataByCountry = summarizeByCategory('country', data);
  const dataByDevice = summarizeByCategory('deviceCategory', data);

  const browserColumn = [
    {
      title: 'Title',
      dataIndex: 'browser',
      key: 'browser',
    },
    ...(defaultColumns)
  ];
  const countryColumn = [
    {
      title: 'Title',
      dataIndex: 'country',
      key: 'country',
    },
    ...(defaultColumns)
  ];

  const doughnutDeviceData = useMemo(() => dataByDevice.map((val) => ({
    labels: Object.keys(val).filter((f) => f !== 'deviceCategory').map((i) => i),
    datasets: [
      {
        label: val.deviceCategory,
        data: Object.values(val).filter((f) => typeof f !== 'string').map((d) => d),
        backgroundColor: [
          '#9BDB48',
          '#FF4D4F',
          '#FCBD3F',
        ],
        hoverOffset: 2,
      }
    ]
  })), [dataByDevice]);

  return (
    <Card title={(
      <Typography.Title level={2}>
        {t('dashboard.gaUserTracking')}
      </Typography.Title>
    )}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
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
          <Card
            type="inner"
            title={(
              <Typography.Title level={4}>
                {t('dashboard.browser')}
              </Typography.Title>
            )}
          >
            <Table
              columns={browserColumn}
              bordered
              dataSource={dataByBrowser}
            />
          </Card>
          <Card
            type="inner"
            title={(
              <Typography.Title level={4}>
                {t('dashboard.country')}
              </Typography.Title>
            )}
          >
            <Table
              columns={countryColumn}
              bordered
              dataSource={dataByCountry}
            />
          </Card>
          <Card
            type="inner"
            title={(
              <Typography.Title level={4}>
                {t('dashboard.device')}
              </Typography.Title>
            )}
          >
            <Row gutter={[16, 16]}>
              {
                doughnutDeviceData.map((val, idx) => (
                  <Col span={12} className="u-mt-32">
                    <div className="u-mb-16 text-uppercase">
                      <Typography.Title level={4}>
                        {val.datasets[0].label}
                      </Typography.Title>
                    </div>
                    <ChartCustom
                      key={`item-${idx.toString()}`}
                      type="doughnut"
                      data={val}
                      options={doughnutOptions}
                      legendCustomId="doughnut-legend-container"
                      width={220}
                      height={220}
                    />
                  </Col>
                ))
              }
            </Row>
          </Card>
        </Space>
      </Spin>
    </Card>
  );
};

export default UserTracking;
