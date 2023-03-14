import {
  Button, Col, ConfigProvider, DatePicker, Input, Row, Select, Space, Switch, Typography,
} from 'antd';
import vi_VN from 'antd/lib/locale/vi_VN';
import React from 'react';
import { Controller, UseFormReturn } from 'react-hook-form';

import Form from 'common/components/Form';

export type OptionTypes = {
  label: string;
  value: string;
};

export type FilterFormTypes = {
  keyword?: string;
  language?: string;
  samplePage?: number;
  isHome?: boolean;
  dateRange?: any; // TODO: convert type follow by API
};

interface ListFilterProps {
  languageList?: OptionTypes[];
  samplePageList?: OptionTypes[];
  method: UseFormReturn<FilterFormTypes>;
  onSubmit: (data: FilterFormTypes) => void;
  handleClose?: () => void;
}
const ListFilter: React.FC<ListFilterProps> = ({
  languageList, samplePageList,
  method, onSubmit, handleClose,
}) => {
  const dateFormat = 'DD/MM/YYYY';
  const { RangePicker } = DatePicker;

  const onReset = () => {
    method.reset();
    method.setValue('language', languageList ? languageList[0].value : undefined);
    method.setValue('samplePage', undefined);
  };

  return (
    <div className="t-listFilter">
      <Form method={method} submitForm={onSubmit}>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <div className="t-listFilter_input">
                <Typography.Text strong>
                  Từ khoá
                </Typography.Text>
                <Controller
                  name="keyword"
                  control={method.control}
                  render={({ field }) => (
                    <Input
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Nhập từ khoá"
                    />
                  )}
                />
              </div>
            </Col>
            {
              languageList
              && (
                <Col span={11} offset={1}>
                  <div className="t-listFilter_input">
                    <Typography.Text strong>
                      Ngôn ngữ
                    </Typography.Text>
                    <Controller
                      name="language"
                      control={method.control}
                      render={({ field }) => (
                        <Select
                          className="u-mt-8"
                          size="large"
                          style={{ width: '100%' }}
                          placeholder="Tất cả"
                          defaultValue={languageList[0].value}
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {
                            languageList.map((val, idx) => (
                              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                {val.label}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                  </div>
                </Col>
              )
            }
          </Row>
          <Row style={{ width: '100%' }}>
            <Col span={12}>
              <div className="t-listFilter_input">
                <Typography.Text strong>
                  Thời gian cập nhật
                </Typography.Text>
                <ConfigProvider locale={vi_VN}>
                  <Controller
                    name="dateRange"
                    control={method.control}
                    render={({ field }) => (
                      <RangePicker
                        className="u-mt-8"
                        allowClear
                        onChange={field.onChange}
                        size="large"
                        value={field.value}
                        format={dateFormat}
                        style={{ width: '100%' }}
                      />
                    )}
                  />
                </ConfigProvider>
              </div>
            </Col>
            {
              samplePageList
              && (
                <Col span={11} offset={1}>
                  <div className="t-listFilter_input">
                    <Typography.Text strong>
                      Trang mẫu
                    </Typography.Text>
                    <Controller
                      name="samplePage"
                      control={method.control}
                      render={({ field }) => (
                        <Select
                          className="u-mt-8"
                          size="large"
                          placeholder="Chọn trang mẫu"
                          style={{ width: '100%' }}
                          onChange={field.onChange}
                          value={field.value}
                        >
                          {
                            samplePageList.map((val, idx) => (
                              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                {val.label}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                  </div>
                </Col>
              )
            }
          </Row>
          <Row>
            <Col>
              <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                <Typography.Text strong>
                  Trang chủ
                </Typography.Text>
                {' '}
                <Controller
                  name="isHome"
                  control={method.control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Space>
            </Col>
          </Row>
        </Space>
        <div className="t-listFilter_action u-mt-26">
          <Space direction="horizontal" size={12} style={{ width: '100%', justifyContent: 'center' }}>
            <Button
              onClick={handleClose}
              size="large"
              type="ghost"
              danger
              className="text-uppercase"
            >
              Đóng
            </Button>
            <Button
              onClick={onReset}
              size="large"
              className="text-uppercase"
            >
              Đặt lại
            </Button>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              className="text-uppercase"
            >
              Tìm kiếm
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default ListFilter;
