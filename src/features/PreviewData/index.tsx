/* eslint-disable no-case-declarations */
import { message } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import useDidMount from 'common/hooks/useDidMount';
import { getSessionStorage, removeSessionStorage } from 'common/services/common/storage';
import { previewNewsService } from 'common/services/news';
import { previewPagesService } from 'common/services/pages';
import LOCAL_STORAGE from 'common/utils/constant';

const PreviewData: React.FC = () => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const dataPreview = getSessionStorage(LOCAL_STORAGE.PREVIEW_DATA);
  const submitPreview = async () => {
    const parser = dataPreview ? JSON.parse(dataPreview) : '';
    try {
      if (!parser) {
        navigator('/');
      }
      switch (parser.type) {
        case 'page':
          const pageData = await previewPagesService(parser.data);
          window.location.replace(pageData.link);
          break;
        case 'news':
          const newsData = await previewNewsService(parser.data);
          window.location.replace(newsData.link);
          break;
        default:
          break;
      }
      removeSessionStorage(LOCAL_STORAGE.PREVIEW_DATA);
    } catch (error) {
      message.error(t('message.previewError'));
    }
  };
  useDidMount(() => {
    submitPreview();
  });
  return null;
};

export default PreviewData;
