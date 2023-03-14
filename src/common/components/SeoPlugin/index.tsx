import {
  EyeOutlined,
} from '@ant-design/icons';
import {
  Typography,
  Divider,
  Button,
} from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CommentList, { CommentListProps } from './CommentList';

export interface SeoPluginProps extends CommentListProps {
  handleOpenPreview?: () => void;
  handleOpenSocialPreview?: () => void;
}

const SeoPlugin: React.FC<SeoPluginProps> = ({
  commentList,
  handleSeeMoreComment,
  handleOpenPreview,
  handleOpenSocialPreview
}) => {
  const { t } = useTranslation();

  return (
    <div className="seoPlugin">
      <div className="seoPlugin_sideBar u-mt-16">
        <Typography.Text type="secondary" className="text-uppercase">{t('system.seoPreview')}</Typography.Text>
        <Divider />
        <div className="seoPlugin_btnGroup">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            block
            onClick={handleOpenPreview}
          >
            {t('system.seoBrowser')}
          </Button>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            block
            onClick={handleOpenSocialPreview}
          >
            {t('system.seoSocials')}
          </Button>
        </div>
      </div>
      <CommentList commentList={commentList} handleSeeMoreComment={handleSeeMoreComment} />
    </div>
  );
};

export default SeoPlugin;
