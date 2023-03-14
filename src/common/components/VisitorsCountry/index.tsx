import {
  Col,
  Progress,
  ProgressProps,
  Row,
  Space,
  Typography,
  DatePicker,
  Spin,
  Empty,
} from 'antd';
import moment from 'moment';
import React from 'react';

import bg from 'common/assets/images/map_vn.svg';
import Image from 'common/components/Image';
import { formatDateYYYYMMDD } from 'common/utils/functions';

type AreaType = {
  value?: number;
  title?: string;
};

interface VisitorsCountryProps {
  title?: string;
  info?: Record<'hn' | 'dn' | 'hcm' | 'differ', AreaType>;
  handleChangeRange?: (val: string[]) => void;
  defaultDate: string[];
  loading?: boolean;
}

const perScale = (val?: number) => (!val ? 0 : Math.max(1, val / 10));

const dateFormat = 'YYYY-MM-DD';

interface ProgressItemProps extends ProgressProps {
  val?: number;
  title?: string;
}

const { RangePicker } = DatePicker;

const ProgressItem: React.FC<ProgressItemProps> = ({
  percent = 0,
  title = '',
  ...props
}) => (
  <Space direction="vertical">
    <Typography.Title level={5} type="secondary">
      {`${title}`}
      :
      {' '}
      <strong style={{ color: '#002B60' }}>{`${percent}%`}</strong>
    </Typography.Title>
    <Progress
      {...props}
      percent={percent}
      showInfo={false}
    />
  </Space>
);

const VisitorsCountry: React.FC<VisitorsCountryProps> = ({
  title,
  info,
  handleChangeRange,
  defaultDate,
  loading,
}) => (
  <div className="t-visitorsCountry">
    <div className="t-visitorsCountry_header">
      <Typography.Title level={3}>{title}</Typography.Title>
      <div className="t-visitorsCountry_header-date">
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
      </div>
    </div>
    <Spin spinning={loading}>
      {info ? (
        <Row className="t-visitorsCountry_wrapMap">
          <Col span={8}>
            <div className="t-visitorsCountry_map">
              <Image src={bg} ratio="206x438" />
              <div className="point hn" style={{ transform: `translate(-50%, -50%) scale(${perScale(info?.hn?.value)})` }} />
              <div className="point dn" style={{ transform: `translate(-50%, -50%) scale(${perScale(info?.dn?.value)})` }} />
              <div className="point hcm" style={{ transform: `translate(-50%, -50%) scale(${perScale(info?.hcm?.value)})` }} />
            </div>
          </Col>
          <Col span={12}>
            <div className="t-visitorsCountry_glossary">
              <ProgressItem
                percent={info?.hcm?.value}
                title={info?.hcm?.title}
                trailColor="rgba(77, 138, 255,0.2)"
                strokeColor="rgba(77, 138, 255)"
              />
              <ProgressItem
                percent={info?.hn?.value}
                title={info?.hn?.title}
                trailColor="rgba(108, 219, 186,0.2)"
                strokeColor="rgba(108, 219, 186)"
              />
              <ProgressItem
                percent={info?.dn?.value}
                title={info?.dn?.title}
                trailColor="rgba(165, 118, 240,0.2)"
                strokeColor="rgba(165, 118, 240)"
              />
              <ProgressItem
                percent={info?.differ?.value}
                title={info?.differ?.title}
                trailColor="rgba(255, 77, 79,0.2)"
                strokeColor="rgba(255, 77, 79)"
              />
            </div>
          </Col>
        </Row>
      ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Spin>
  </div>
);

export default VisitorsCountry;
