import {
  Typography,
  Divider,
  Select,
} from 'antd';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import PageHeaderSection, { PageHeaderSectionActionRef } from './PageHeaderSection';

import SeoPlugin, { SeoPluginProps } from 'common/components/SeoPlugin';

interface SidebarProps extends SeoPluginProps {
  status: number;
  pageTemplates: OptionType[];
  parents: OptionType[];
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
  languageList?: OptionType[];
  currentLang?: string,
  handleChangeLang?: (value: string) => void;
  handleChangeTemplate: (code: string) => void;
}

const Sidebar = forwardRef<PageHeaderSectionActionRef, SidebarProps>(({
  status,
  pageTemplates,
  parents,
  createdDate,
  lastUpdated,
  createdBy,
  lastUpdatedBy,
  languageList,
  currentLang,
  handleChangeLang,
  handleChangeTemplate,
  handleOpenPreview,
  handleOpenSocialPreview,
  handleSeeMoreComment,
  commentList,
}, ref) => {
  const { t } = useTranslation();
  return (
    <div className="p-editPageTemplate_sideBarWrapper">
      <PageHeaderSection
        ref={ref}
        status={status}
        sampleOptions={pageTemplates}
        parentPageOptions={parents}
        handleChangeTemplate={handleChangeTemplate}
      />
      <div className="p-editPageTemplate_sideBar u-mt-16">
        <Typography.Text type="secondary" className="text-uppercase">{t('system.information')}</Typography.Text>
        <Divider />
        <div className="p-editPageTemplate_sideBar-item">
          <Typography.Text strong>{t('system.created')}</Typography.Text>
          <Typography.Text type="secondary">{createdDate}</Typography.Text>
        </div>
        <div className="p-editPageTemplate_sideBar-item">
          <Typography.Text strong>{t('system.by')}</Typography.Text>
          <Typography.Text type="secondary">{createdBy}</Typography.Text>
        </div>
        <div className="p-editPageTemplate_sideBar-item">
          <Typography.Text strong>{t('system.updated')}</Typography.Text>
          <Typography.Text type="secondary">{lastUpdated}</Typography.Text>
        </div>
        <div className="p-editPageTemplate_sideBar-item">
          <Typography.Text strong>{t('system.by')}</Typography.Text>
          <Typography.Text type="secondary">{lastUpdatedBy}</Typography.Text>
        </div>
        <Divider />
        <Typography.Paragraph strong>
          {t('system.language')}
        </Typography.Paragraph>
        <Select
          style={{ minWidth: '120px' }}
          className="u-mt-8"
          size="large"
          placeholder={t('system.selectLanguage')}
          onChange={handleChangeLang}
          value={currentLang}
        >
          {
            languageList?.map((val, idx) => (
              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                {val.label}
              </Select.Option>
            ))
          }
        </Select>
      </div>
      <SeoPlugin
        commentList={commentList}
        handleSeeMoreComment={handleSeeMoreComment}
        handleOpenPreview={handleOpenPreview}
        handleOpenSocialPreview={handleOpenSocialPreview}
      />
    </div>
  );
});

export default Sidebar;
