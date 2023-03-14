import {
  Avatar,
  Space, Timeline, Typography
} from 'antd';
import moment from 'moment';
import React from 'react';

import Link, { LinkProps } from 'common/components/Link';

export interface ActivityLogsCardProps {
  time?: string;
  avatar?: string;
  bgAvatar?: string;
  alt?: string;
  name?: string;
  content?: string;
  titleDesc?: string;
  link?: LinkProps;
}

const ActivityLogsCard: React.FC<ActivityLogsCardProps> = ({
  avatar,
  alt,
  time,
  name,
  content,
  link,
  bgAvatar,
  titleDesc,
}) => (
  <Timeline.Item
    label={(
      <Typography.Paragraph type="secondary">
        {time && moment(time).calendar()}
      </Typography.Paragraph>
    )}
    dot={<div className="t-activityLogsCard_dot" />}
  >
    <Space>
      <div className="t-activityLogsCard_avatar">
        {avatar ? (
          <Avatar src={avatar} size={56} alt={alt} />
        ) : (
          <Avatar
            style={{ backgroundColor: bgAvatar || '#012B61' }}
            size={56}
            alt={alt}
          >
            {!avatar ? alt : ''}
          </Avatar>
        )}
      </div>
      <Typography.Title level={5}>{name}</Typography.Title>
    </Space>
    <Typography.Title level={5} className="t-activityLogsCard_title">
      <Link {...link}>
        {link?.title}
      </Link>
    </Typography.Title>
    <div className="t-activityLogsCard_panel">
      <Typography.Paragraph>
        {content}
        {' '}
        <Link {...link}><b>{titleDesc}</b></Link>
      </Typography.Paragraph>
    </div>
  </Timeline.Item>
);

export default ActivityLogsCard;
