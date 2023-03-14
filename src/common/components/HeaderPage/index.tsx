import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import React, {
  CSSProperties, useContext
} from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LayoutContext } from '../Mainlayout/context';

import { COLORS } from 'common/utils/constant';
import mapModifiers from 'common/utils/functions';

interface HeaderPageProps {
  fixed?: boolean;
  title: string;
  rightHeader?: React.ReactNode;
}

interface CustomCSS extends CSSProperties {
  '--sidebar-width': string;
}

const HeaderPage: React.FC<HeaderPageProps> = ({
  fixed,
  title,
  rightHeader
}) => {
  const { t } = useTranslation();
  const { collapsed } = useContext(LayoutContext);
  const navigator = useNavigate();

  return (
    <div
      className={mapModifiers('t-headerPage', fixed && 'fixed')}
      style={{ '--sidebar-width': collapsed ? '80px' : '250px' } as CustomCSS}
    >
      <Header className="t-headerPage_wrapper">
        <Button
          className="t-headerPage_buttonBack"
          icon={<ArrowLeftOutlined size={16} />}
          type="text"
          onClick={() => navigator(-1)}
          style={{ color: COLORS.COOL_BLACK }}
        >
          {t('system.back')}
        </Button>
        <div className="t-headerPage_content">
          <div className="t-headerPage_leftHeader">
            <Typography.Title level={(fixed) ? 4 : 2}>
              {title}
            </Typography.Title>
          </div>
          <div className="t-headerPage_rightHeader">
            <Space>
              {rightHeader}
            </Space>
          </div>
        </div>
      </Header>
    </div>
  );
};

export default HeaderPage;
