import { Typography, Progress } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'common/components/Icon';
import Image from 'common/components/Image';
import StatusLabel from 'common/components/StatusLabel';
import mapModifiers from 'common/utils/functions';

export type StatusQuickActionType = 1 | 7 | 13;

type PostStatusObj = {
  status?: StatusQuickActionType;
  amount?: number;
};

export interface QuickActionCardProps {
  thumbnail?: string;
  alt?: string;
  postStatusList?: PostStatusObj[];
  productivityPerCent?: number;
  btnSeeMore?: string;
  type?: string;
  typeLabel?: string;
  handleSeeMore?: () => void
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  thumbnail,
  alt,
  postStatusList,
  productivityPerCent,
  btnSeeMore,
  type,
  typeLabel,
  handleSeeMore,
}) => {
  const { t } = useTranslation();
  return (
    <div className="t-quickActionCard">
      <div className="t-quickActionCard_thumbnail">
        {typeLabel && (
          <div className={mapModifiers('t-quickActionCard_label', type)}>
            {typeLabel}
          </div>
        )}
        <Image src={thumbnail || ''} ratio="264x176" alt={alt} />
      </div>
      <div className="t-quickActionCard_content">
        {postStatusList && postStatusList?.length > 0 && (
          <div className="t-quickActionCard_postList">
            {postStatusList.map((item, idx) => (
              <div className="t-quickActionCard_postList-item" key={`${alt}-status-${String(idx)}`}>
                <StatusLabel status={item.status || 1} type="secondary" />
                <Typography.Title level={4} style={{ textAlign: 'center', color: '#002B60' }}>
                  {item.amount}
                </Typography.Title>
              </div>
            ))}
          </div>
        )}
        <div className="t-quickActionCard_productivity">
          <div className="t-quickActionCard_productivity-content">
            <Typography.Paragraph style={{ color: '#8C8C8C' }}>
              {`${t('system.productivity')}:`}
            </Typography.Paragraph>
            <Typography.Paragraph strong style={{ color: '#002B60' }}>
              {` ${productivityPerCent || 0}%`}
            </Typography.Paragraph>
          </div>
        </div>
        <Progress
          percent={productivityPerCent}
          strokeColor="#FF4D4F"
          trailColor="rgba(255, 77, 79, 0.2)"
          showInfo={false}
        />
        <div
          className="t-quickActionCard_showMore"
          onClick={handleSeeMore}
        >
          <span>
            {btnSeeMore || t('system.seeAll')}
          </span>
          <span className="t-quickActionCard_button-icon">
            <Icon iconName="nextBlue" size="16" />
          </span>
        </div>
      </div>
    </div>
  );
};
export default QuickActionCard;
