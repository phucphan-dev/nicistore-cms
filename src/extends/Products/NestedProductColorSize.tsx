/* eslint-disable import/no-cycle */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Card, Col, Modal, Row, Space, Typography
} from 'antd';
import React from 'react';
import {
  Control, Controller, useFieldArray
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ProductFormTypes } from './Detail';

import { DropdownElement } from 'common/components/DropdownType';
import Input from 'common/components/Input';

type NestedFieldArrayTypes = {
  control: Control<ProductFormTypes, any>;
};

const nestedFieldArrayDefaultData = {
  colorId: null,
  sizeId: null,
  quantity: 0,
};

const ColorSizeNestedArray: React.FC<NestedFieldArrayTypes> = ({ control }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'colorSize',
  });

  return (
    <div className="site-card-border-less-wrapper">
      <Space
        direction="horizontal"
        size={12}
        style={{
          width: '100%', justifyContent: 'center', marginTop: '12px', flexDirection: 'column', alignItems: 'unset'
        }}
      >
        {
          fields && fields.length > 0 && fields.map((itemField, i) => (
            <Card
              key={itemField.id}
              title={(
                <div className="p-editPageTemplate_blockHeader">
                  <Typography.Text>
                    Màu sắc - Kích thước
                  </Typography.Text>
                  <Button
                    type="text"
                    size="small"
                    onClick={(e) => {
                      if (e.stopPropagation) e.stopPropagation();
                      Modal.confirm({
                        className: 't-pagetable_deleteLanguageModal',
                        autoFocusButton: 'cancel',
                        okText: t('system.ok'),
                        cancelText: t('system.cancel'),
                        cancelButtonProps: {
                          type: 'primary',
                        },
                        okButtonProps: {
                          type: 'default',
                        },
                        title: t('message.confirmDeleteRecord'),
                        onOk: () => {
                          remove(i);
                        },
                      });
                    }}
                    icon={(<DeleteOutlined />)}
                  />
                </div>
              )}
            >
              <Row gutter={16}>
                <Col xxl={8} xl={12}>
                  <div className="p-editPageTemplate_input">
                    <Typography.Text strong>
                      {t('product.colors')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`colorSize.${i}.colorId`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <DropdownElement
                          type="colors"
                          placeholder="Please select"
                          locale="vi"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col xxl={8} xl={6}>
                  <div className="p-editPageTemplate_input">
                    <Typography.Text strong>
                      {t('product.sizes')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`colorSize.${i}.sizeId`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <DropdownElement
                          type="sizes"
                          placeholder="Please select"
                          locale="vi"
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col xxl={8} xl={6}>
                  <div className="p-editPageTemplate_input">
                    <Typography.Text strong>
                      {t('product.quantity')}
                    </Typography.Text>
                    <Controller
                      name={`colorSize.${i}.quantity`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          className="u-mt-8"
                          value={field.value}
                          placeholder="Nhập số lượng"
                          onChange={(e) => field.onChange(Number(e.currentTarget.value))}
                          error={error?.message}
                          size="middle"
                          type="number"
                        />
                      )}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          ))
        }
      </Space>
      <Space
        direction="horizontal"
        size={12}
        style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
      >
        <Button
          size="middle"
          type="primary"
          icon={(<PlusOutlined />)}
          onClick={() => {
            append(nestedFieldArrayDefaultData);
          }}
        >
          Thêm màu sắc - kích thước
        </Button>
      </Space>
    </div>
  );
};

export default ColorSizeNestedArray;
