import { UploadOutlined } from '@ant-design/icons';
import {
  Button, Card, Col, Row, Select, Space, Typography, Upload,
} from 'antd';
import React from 'react';
import {
  Controller,
} from 'react-hook-form';

import Editor from 'common/components/Editor';
import Input from 'common/components/Input';

interface RepeaterSectionProps {
  linkTargetOptions: OptionType[];
  id: number;
}

const RepeaterSection: React.FC<RepeaterSectionProps> = ({
  linkTargetOptions,
  id = 0,
}) => (
  <div className="t-repeatersection" id={`repeater-ckeditor-${id}`}>
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <div className="t-detailpage_input">
        <Typography.Text strong>
          Mô tả
        </Typography.Text>
        <Controller
          name={`blockSection.${id}.description`}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Input
              className="u-mt-8"
              value={value}
              onChange={onChange}
              error={error?.message}
              size="large"
            />
          )}
        />
      </div>
      <div className="t-detailpage_input">
        <Typography.Text strong>
          Nội dung
        </Typography.Text>
        <div className="u-mt-8">
          <Controller
            name={`blockSection.${id}.content`}
            render={({ field: { value, onChange } }) => (
              <Editor
                value={value}
                handleChange={(_event: any, editor: any) => {
                  const data = editor.getData();
                  // if (handleCKEditorChange) handleCKEditorChange(data);
                  onChange(data);
                }}
              />
            )}
          />
        </div>
      </div>
      <div className="t-detailpage_upload">
        <Typography.Text strong>
          Hình ảnh
        </Typography.Text>
        <Controller
          name={`blockSection.${id}.ogImage`}
          render={({ field: { onChange } }) => (
            <Upload
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76" // TODO: replace with API URL
              listType="picture-card"
              maxCount={1}
              accept="image/png, image/gif, image/jpeg"
              onChange={onChange}
            >
              <Button icon={<UploadOutlined />}>
                Upload Hình ảnh
              </Button>
            </Upload>
          )}
        />
      </div>
      <Card
        title={(
          <Typography.Title level={5}>
            Link
          </Typography.Title>
        )}
        style={{ width: '100%' }}
      >
        <Row gutter={14}>
          <Col span={8}>
            <Typography.Text strong>
              Text
            </Typography.Text>
            <Controller
              name={`blockSection.${id}.link`}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Input
                  size="large"
                  className="u-mt-8"
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </Col>
          <Col span={8}>
            <Typography.Text strong>
              Url
            </Typography.Text>
            <Controller
              name={`blockSection.${id}.url`}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Input
                  size="large"
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </Col>
          <Col span={8}>
            <Typography.Text strong>
              Target
            </Typography.Text>
            <Controller
              name={`blockSection.${id}.target`}
              render={({ field: { value, onChange } }) => (
                <Select
                  className="u-mt-8"
                  style={{ width: '100%' }}
                  placeholder="---"
                  value={value}
                  onChange={onChange}
                >
                  {
                    linkTargetOptions.map((val, idx) => (
                      <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                        {val.label}
                      </Select.Option>
                    ))
                  }
                </Select>
              )}
            />
          </Col>
        </Row>
      </Card>
    </Space>
  </div>
);

export default RepeaterSection;
