import { Divider, Select, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ManagementInfoProps {
  createdDate: string;
  lastUpdated: string;
  createdBy: string;
  lastUpdatedBy: string;
  languageList?: OptionType[];
  currentLang?: string;
  classNameCustom?: string;
  handleChangeLang?: (value?: string) => void;
}

const ManagementInfo: React.FC<ManagementInfoProps> = ({
  createdDate, lastUpdated, createdBy, lastUpdatedBy,
  languageList, currentLang, classNameCustom, handleChangeLang
}) => {
  const { t } = useTranslation();

  return (
    <div className={`o-managementInfo${classNameCustom ? ` ${classNameCustom}` : ''}`}>
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
      {languageList && (
        <>
          <Divider />
          <Typography.Paragraph strong>
            {t('system.language')}
          </Typography.Paragraph>
          <Select
            className="o-managementInfo_selectLanguage"
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

        </>
      )}
    </div>
  );
};

export default ManagementInfo;
