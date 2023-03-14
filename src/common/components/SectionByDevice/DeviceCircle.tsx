import { Typography } from 'antd';
import React, {
  useState,
  useMemo,
}
  from 'react';

import Icon, { IconName } from 'common/components/Icon';
import mapModifiers from 'common/utils/functions';

export type DeviceData = {
  percent: number;
  amount: number;
};

export interface DeviceCircleProps {
  deviceData?: {
    desktop: DeviceData;
    tablet: DeviceData;
    mobile: DeviceData;
  }
}

type DeviceInfoProps = {
  type: string;
  amount: number;
  activeDevice?: string;
  handleHoverItem: (type?: string) => void;
};

const DeviceInfo: React.FC<DeviceInfoProps> = ({
  type,
  amount,
  activeDevice,
  handleHoverItem,
}) => (
  <div
    className={mapModifiers(
      'o-deviceCircle_list-item',
      type === activeDevice ? 'active' : '',
    )}
    onMouseEnter={() => handleHoverItem(type)}
    onMouseLeave={() => handleHoverItem('')}
  >
    <div className={mapModifiers('o-deviceCircle_iconWrapper', type)}>
      <div className="o-deviceCircle_iconWrapper-icon">
        <Icon iconName={type as IconName} size="16" />
      </div>
    </div>
    <div className="o-deviceCircle_list-content">
      <Typography.Title level={4} style={{ color: '#1F1F1F' }}>
        {amount}
      </Typography.Title>
      <Typography.Text style={{ color: '#8C8C8C' }}>
        {type}
      </Typography.Text>
    </div>
  </div>
);

const DeviceCircle: React.FC<DeviceCircleProps> = ({
  deviceData,
}) => {
  const [activeDevice, setActiveDevice] = useState('');

  const dataListArr = useMemo(() => {
    if (deviceData) {
      return Object.entries(deviceData).map(([key, value]) => ({ type: key, ...value }));
    }
    return [];
  }, [deviceData]);

  const sortedArr = useMemo(() => dataListArr?.filter((el) => el.percent > 0)
    .sort((a, b) => b.percent - a.percent), [dataListArr]);

  const handleHoverItem = (type: string) => setActiveDevice(type);

  return (
    <div className="o-deviceCircle">
      <div className="o-deviceCircle_wrapper">
        {sortedArr && sortedArr?.map((item) => (
          <div
            className={mapModifiers(
              'o-deviceCircle_item',
              item?.type,
              activeDevice === item?.type ? 'active' : '',
            )}
            onMouseEnter={() => setActiveDevice(item?.type)}
            onMouseLeave={() => setActiveDevice('')}
            key={`type-${item?.type}`}
            style={{
              width: `${item.percent}%`,
            }}
          >
            <div className="o-deviceCircle_item-content">
              <Typography.Paragraph strong style={{ color: 'white' }}>
                {`${item.percent}%`}
              </Typography.Paragraph>
            </div>
          </div>
        ))}
      </div>
      <div className="o-deviceCircle_list">
        {dataListArr.map((item, idx) => (
          <DeviceInfo
            type={item.type}
            activeDevice={activeDevice}
            amount={item.amount || 0}
            handleHoverItem={(type) => handleHoverItem(type || '')}
            key={`${item.type}-${String(idx)}`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceCircle;
