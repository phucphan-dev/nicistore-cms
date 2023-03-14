import {
  Typography,
  Modal,
  Tabs,
} from 'antd';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ValidString from './ValidString';
import { SeoFormTypes } from './types';

import Image from 'common/components/Image';

interface SocialPreviewModalProps {
  href?: string;
  isOpen?: boolean;
  handleIsOpen: (open: boolean) => void;
  seoData?: SeoFormTypes;
  socialList?: OptionType[];
}

const SocialPreviewModal: React.FC<SocialPreviewModalProps> = ({
  isOpen,
  handleIsOpen,
  seoData,
  href,
  socialList,
}) => {
  const { t } = useTranslation();

  const getSocialLabel = useCallback((id: number) => {
    if (socialList) {
      return socialList?.find((item) => item.value === id)?.label;
    }
    return '';
  }, [socialList]);
  const countSplitText = (text: string) => {
    if (text) {
      return text.split(',').length;
    }
    return 0;
  };

  return (
    <Modal
      title={<Typography.Title level={3}>{t('preview.socialPreview')}</Typography.Title>}
      visible={isOpen}
      onCancel={() => handleIsOpen(false)}
      footer={null}
      width={600}
    >
      {seoData && seoData?.mediaSocial.length > 0 ? (
        <Tabs defaultActiveKey="1">
          {seoData?.mediaSocial.map((item, idx) => (
            <Tabs.TabPane tab={`${item.ogType ? getSocialLabel(item.ogType) : ''}`} key={`${idx + 1}`}>
              <div className="p-editPageTemplate_thumbnailBox">
                {item.ogImage && (
                  <Image
                    src={item.ogImage}
                    alt={`${item?.ogTitle}-social-img`}
                    ratio="436x200"
                  />
                )}
                <div className="p-editPageTemplate_thumbnailBox-content">
                  <Typography.Paragraph strong>
                    {item?.ogTitle}
                  </Typography.Paragraph>
                  <Typography.Paragraph>
                    {item?.ogDescription}
                  </Typography.Paragraph>
                  <Typography.Paragraph className="p-editPageTemplate_thumbnailBox-url">
                    {href}
                  </Typography.Paragraph>
                </div>
              </div>
              <ValidString
                isValid={(item?.ogTitle?.length > 1 && item?.ogTitle?.length <= 60)}
                validText={`${t('preview.socialTitle')} ${item?.ogTitle?.length} ${t('preview.socialMaxTitle')}`}
              />
              <ValidString
                isValid={
                  (seoData && seoData.seoIntro
                    && (seoData.seoIntro.length > 1 && seoData?.seoIntro.length <= 160)) || true
                }
                validText={`${t('preview.socialDescription')} ${seoData?.seoIntro?.length} ${t('preview.socialMaxDescription')}`}
              />
              <ValidString
                isValid={
                  seoData
                  && (countSplitText(seoData?.seoKeyword || '') >= 1)
                }
                validText={`${t('preview.socialUseKeyword')} ${countSplitText(seoData?.seoKeyword || '')} ${t('preview.socialKeywords')} (${seoData?.seoKeyword})`}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      ) : (
        <Typography.Paragraph>
          {t('preview.socialEnterInfo')}
        </Typography.Paragraph>
      )}
    </Modal>
  );
};
SocialPreviewModal.defaultProps = {
  href: '',
  isOpen: false,
  seoData: undefined,
};

export default SocialPreviewModal;
