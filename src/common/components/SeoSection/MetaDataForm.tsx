/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Typography,
  Row,
  Col,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Input from 'common/components/Input';

const MetaDataForm: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="seoSection_metaData">
      <Row gutter={16}>
        <Col span={24}>
          <div className="seoSection_input">
            <Typography.Text strong>
              {t('system.keywords')}
            </Typography.Text>
            <Controller
              name="seoKeyword"
              render={({ field }) => (
                <TextArea
                  {...field}
                  className="u-mt-8"
                  value={field.value}
                  onChange={field.onChange}
                  size="large"
                  rows={2}
                  style={{ minHeight: 80 }}
                />
              )}
            />
          </div>
        </Col>
        {/* <Col span={12}>
          <div className="seoSection_input">
            <Typography.Text strong>
              Meta Robots
            </Typography.Text>
            <Controller
              name="metaRobot"
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
        </Col> */}
      </Row>
      {/* <div className="seoSection_input">
        <Typography.Text strong>
          Structured Data
        </Typography.Text>
        <Controller
          name="structuredData"
          render={({ field }) => (
            <TextArea
              {...field}
              className="u-mt-8"
              value={field.value}
              onChange={field.onChange}
              size="large"
              rows={2}
              style={{ minHeight: 50 }}
            />
          )}
        />
        <Row gutter={16}>
          <Col span={12}>
            <div className="seoSection_input">
              <Typography.Text strong>
                Meta Viewport
              </Typography.Text>
              <Controller
                name="metaViewPort"
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
                CanonicalURL
              </Typography.Text>
              <Controller
                name="canonicalURL"
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
      </div> */}
    </div>
  );
};

export default MetaDataForm;
