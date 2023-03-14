import {
  Space,
  Typography,
  Spin,
} from 'antd';
import React from 'react';

import QuickActionCard, { QuickActionCardProps } from './QuickActionCard';

interface QuickActionProps {
  dataList?: QuickActionCardProps[];
  title: string;
  isLoading?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  dataList,
  title,
  isLoading,
}) => (
  <div className="t-quickAction">
    <div className="t-quickAction_header">
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>{title}</Typography.Title>
      </Space>
    </div>
    <Spin spinning={isLoading}>
      {dataList && dataList.length > 0 && (
        <div className="t-quickAction_list">
          {dataList.map((item, index) => (
            <div className="t-quickAction_list-item" key={`quickActionCard-${index.toString()}`}>
              <QuickActionCard
                {...item}
              />
            </div>
          ))}
        </div>
      )}
    </Spin>
  </div>
);

export default QuickAction;
