import {
  Space,
  Timeline,
  Typography,
  Spin,
} from 'antd';
import React from 'react';

import ActivityLogsCard, { ActivityLogsCardProps } from './ActivityLogsCard';

interface ActivityLogsProps {
  dataList: ActivityLogsCardProps[];
  title: string;
  loading?: boolean
}

const ActivityLogs: React.FC<ActivityLogsProps> = ({ dataList, title, loading }) => (
  <div className="t-activityLogs">
    <div className="t-activityLogs_header">
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>{title}</Typography.Title>
      </Space>
    </div>
    <div className="t-activityLogs_timeline">
      <Spin spinning={loading}>
        {dataList && dataList.length > 0 && (
          <Timeline mode="left" className="t-activityLogs_list">
            {dataList.map((item, index) => (
              <ActivityLogsCard
                key={`activityLogs-${index.toString()}`}
                {...item}
              />
            ))}
          </Timeline>
        )}
      </Spin>
    </div>
  </div>
);

export default ActivityLogs;
