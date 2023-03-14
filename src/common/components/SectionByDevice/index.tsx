import {
  DatePicker,
  Typography,
  Spin,
  Empty,
} from 'antd';
import moment from 'moment';
import React from 'react';

import DeviceCircle, { DeviceData } from './DeviceCircle';

import { formatDateYYYYMMDD } from 'common/utils/functions';

interface SectionByDeviceProps {
  title: string;
  deviceData?: {
    desktop: DeviceData;
    tablet: DeviceData;
    mobile: DeviceData;
  }
  handleChangeRange?: (val: string[]) => void;
  defaultDate: string[];
  loading?: boolean;
}

const { RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD';

const SectionByDevice: React.FC<SectionByDeviceProps> = ({
  title,
  deviceData,
  handleChangeRange,
  defaultDate,
  loading,
}) => (
  <div className="t-sectionByDevice">
    <div className="t-sectionByDevice_header">
      <Typography.Title level={3}>{title}</Typography.Title>
      <div className="t-sectionByDevice_header-date">
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
    <div className="t-sectionByDevice_content">
      <Spin spinning={loading}>
        {deviceData ? (
          <DeviceCircle
            deviceData={deviceData}
          />
        ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      </Spin>
    </div>
  </div>
);

export default SectionByDevice;
