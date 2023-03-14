import {
  Typography,
  Space,
} from 'antd';
import React from 'react';

interface TopKeywordProps {
  dataList?: {
    id: number;
    name: string;
  }[];
  title: string;
  handleClick?: (id: number) => void
}

const TopKeyword: React.FC<TopKeywordProps> = ({
  title,
  dataList,
  handleClick,
}) => (
  <div className="t-keywords">
    <div className="t-keywords_header">
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>{title}</Typography.Title>
      </Space>
    </div>
    {dataList && dataList?.length > 0 && (
      <div className="t-keywords_list">
        {dataList.map((item, idx) => (
          <div
            className="t-keywords_list-item"
            key={`keyword-${String(idx)}`}
            onClick={() => handleClick && handleClick(item.id)}
          >
            <Typography.Text style={{ color: '#595959' }}>{item.name}</Typography.Text>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TopKeyword;
