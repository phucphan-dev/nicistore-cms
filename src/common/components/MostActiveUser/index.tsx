import {
  Space,
  Typography,
  Avatar,
  Tooltip,
} from 'antd';
import React from 'react';

import { getFirstLetters } from 'common/utils/functions';

type UserData = {
  id: number;
  name: string;
  avatar: string;
  email: string;
};

type UserInfoProps = {
  name: string;
  email: string;
};

interface MostActiveUserProps {
  title: string;
  dataList?: UserData[];
  handleClickUser?: (id: number) => void
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  email,
}) => (
  <div className="t-mostActiveUser_userInfo">
    <Typography.Title
      level={5}
      style={{ color: 'white' }}
    >
      {name}
    </Typography.Title>
    <Typography.Paragraph style={{ color: 'white' }}>{email}</Typography.Paragraph>
  </div>
);

const MostActiveUser: React.FC<MostActiveUserProps> = ({
  title,
  dataList,
  handleClickUser,
}) => (
  <div className="t-mostActiveUser">
    <div className="t-mostActiveUser_header">
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>{title}</Typography.Title>
      </Space>
    </div>
    {dataList && dataList.length > 0 && (
      <div className="t-mostActiveUser_list">
        {dataList.map((item, index) => (
          <div
            className="t-mostActiveUser_list-item"
            key={`avatar-${String(index)}`}
            onClick={() => handleClickUser && handleClickUser(item.id)}
          >
            <Tooltip
              title={<UserInfo name={item.name} email={item.email} />}
              color="#3C3C3C"
              overlayStyle={{
                borderRadius: '8px',
              }}
            >
              {item.avatar
                ? (
                  <Avatar src={item.avatar} size={56} />
                ) : (
                  <Avatar style={{ backgroundColor: '#012B61' }} size={56}>
                    {getFirstLetters(item.name)}
                  </Avatar>
                )}
            </Tooltip>
          </div>
        ))}
      </div>
    )}
  </div>
);
export default MostActiveUser;
