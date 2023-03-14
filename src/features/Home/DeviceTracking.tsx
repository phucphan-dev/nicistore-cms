import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';

import SectionByDevice from 'common/components/SectionByDevice';
import { DeviceData } from 'common/components/SectionByDevice/DeviceCircle';
import {
  getDeviceTrackingService,
} from 'common/services/dashboard';

interface DeviceTrackingProps {
  title: string;
}

type DeviceDataItem = {
  desktop: DeviceData;
  tablet: DeviceData;
  mobile: DeviceData;
};

const DeviceTracking: React.FC<DeviceTrackingProps> = ({
  title
}) => {
  const defaultDate = [
    moment(new Date()).format('YYYY-MM-DD'),
    moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
  ];
  const [currentRange, setCurrentRange] = useState<string[]>(defaultDate);
  const { data, isLoading, isFetching } = useQuery(
    ['getDropdownCategoryType', currentRange],
    () => getDeviceTrackingService({
      from: currentRange[0],
      to: currentRange[1],
    }),
    { enabled: currentRange.length === 2 }
  );
  const total = useMemo(() => data?.reduce(
    (previousValue, currentValue) => previousValue + currentValue.sessions,
    0
  ) || 1, [data]);

  const deviceData = useMemo(() => data?.reduce((a, v) => ({
    ...a,
    [v.deviceCategory]: {
      percent: ((v.sessions / total) * 100).toFixed(2),
      amount: v.sessions,
    }
  }), {}), [total, data]) as DeviceDataItem;

  return (
    <SectionByDevice
      title={title}
      deviceData={deviceData}
      defaultDate={defaultDate}
      handleChangeRange={(val) => setCurrentRange(val)}
      loading={isLoading || isFetching}
    />
  );
};

export default DeviceTracking;
