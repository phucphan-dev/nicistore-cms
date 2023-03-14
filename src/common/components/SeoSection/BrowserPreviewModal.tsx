import {
  Typography,
  Modal,
  Switch,
} from 'antd';
import moment from 'moment';
import React, {
  useState
} from 'react';
import { useTranslation } from 'react-i18next';

import ValidString from './ValidString';
import { SeoFormTypes } from './types';

import mapModifers from 'common/utils/functions';

interface BrowserPreviewModalProps {
  href?: string;
  isOpen?: boolean;
  handleIsOpen: (open: boolean) => void;
  seoData?: SeoFormTypes;
}

const BrowserPreviewModal: React.FC<BrowserPreviewModalProps> = ({
  isOpen,
  handleIsOpen,
  seoData,
  href,
}) => {
  const { t } = useTranslation();
  const [previewChecked, setPreviewChecked] = useState(false);
  const countSplitText = (text: string) => {
    if (text) {
      return text.split(',').length;
    }
    return 0;
  };

  return (
    <Modal
      title={<Typography.Title level={3}>Browser Preview</Typography.Title>}
      visible={isOpen}
      onCancel={() => handleIsOpen(false)}
      footer={null}
      width={600}
    >
      <div className="p-editPageTemplate_switch">
        <Switch
          checked={previewChecked}
          onChange={setPreviewChecked}
        />
        <span className={mapModifers('p-editPageTemplate_switchLabel', previewChecked && 'checked')}>
          {previewChecked ? 'Mobile' : 'Web'}
        </span>
      </div>
      <div className={mapModifers('p-editPageTemplate_seoBox', previewChecked && 'checked')}>
        <Typography.Text className="p-editPageTemplate_seoBox-title">
          {seoData?.seoTitle}
        </Typography.Text>
        <Typography.Text className="p-editPageTemplate_seoBox-url">
          {href}
        </Typography.Text>
        {seoData?.seoIntro && (
          <Typography.Text className="p-editPageTemplate_seoBox-description">
            <span>
              {`${moment().format('MMM DD, YYYY')} - `}
            </span>
            {seoData?.seoIntro}
          </Typography.Text>
        )}
      </div>
      <ValidString
        isValid={
          (seoData && seoData.seoTitle
            && (seoData.seoTitle.length > 1 && seoData.seoTitle.length <= 60)) || true
        }
        validText={`${t('preview.socialTitle')} ${seoData?.seoTitle?.length} ${t('preview.socialMaxTitle')}`}
      />
      <ValidString
        isValid={
          (seoData && seoData.seoIntro
            && (seoData.seoIntro.length > 1 && seoData.seoIntro.length <= 160)) || true
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
    </Modal>
  );
};

BrowserPreviewModal.defaultProps = {
  href: '',
  isOpen: false,
  seoData: undefined,
};

export default BrowserPreviewModal;
