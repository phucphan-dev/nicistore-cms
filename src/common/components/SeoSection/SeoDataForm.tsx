import {
  Typography,
  Row,
  Col,
} from 'antd';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Input from 'common/components/Input';
import SelectFile from 'common/components/SelectFile';

const SeoDataForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="seoSection_seoData">
      <Row gutter={16}>
        <Col span={12}>
          <div className="seoSection_input">
            <Typography.Text strong>
              {t('system.title')}
            </Typography.Text>
            <Controller
              name="seoTitle"
              render={({ field }) => (
                <Input
                  {...field}
                  className="u-mt-8"
                  value={field.value}
                  onChange={field.onChange}
                  size="large"
                />
              )}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="seoSection_input">
            <Typography.Text strong>
              {t('system.description')}
            </Typography.Text>
            <Controller
              name="seoIntro"
              render={({ field }) => (
                <Input
                  {...field}
                  className="u-mt-8"
                  value={field.value}
                  onChange={field.onChange}
                  size="large"
                />
              )}
            />

          </div>
        </Col>
      </Row>
      <div className="seoSection_upload">
        <Controller
          name="ogImage"
          render={({
            field: { value, onChange },
          }) => (
            <SelectFile
              title={t('system.image')}
              value={value}
              name="ogImage"
              handleSelect={(url) => onChange(url)}
              handleDelete={() => onChange(undefined)}
            />
          )}
        />
      </div>
    </div>
  );
};

export default SeoDataForm;
