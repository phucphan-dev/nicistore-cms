/* eslint-disable import/no-cycle */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button, Card, Col, Image, Modal, Row, Space, Typography
} from 'antd';
import React from 'react';
import {
  Control, Controller, useFieldArray
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { OrderDataFormType } from './Detail';

import { DropdownElement } from 'common/components/DropdownType';
import Input from 'common/components/Input';

type NestedFieldArrayTypes = {
  control: Control<OrderDataFormType, any>;
};

const nestedFieldArrayDefaultData = {
  productId: undefined,
  sizeId: undefined,
  colorId: undefined,
  quantity: 0,
  code: undefined,
  thumbnail: undefined
};

const NestedOrderItem: React.FC<NestedFieldArrayTypes> = ({ control }) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  return (
    <div className="site-card-border-less-wrapper">
      <Space
        direction="horizontal"
        size={12}
        style={{
          width: '100%', justifyContent: 'center', flexDirection: 'column', alignItems: 'unset'
        }}
      >
        {
          fields && fields.length > 0 && fields.map((itemField, i) => (
            <Card
              key={itemField.id}
              title={(
                <div className="p-editPageTemplate_blockHeader">
                  <Typography.Text>
                    Sản phẩm đặt hàng
                  </Typography.Text>
                  <Button
                    type="text"
                    size="small"
                    onClick={(e) => {
                      if (e.stopPropagation) e.stopPropagation();
                      if (!fields[i].productId && !fields[i].colorId
                        && !fields[i].sizeId && !fields[i].quantity) {
                        remove(i);
                      } else {
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
                      }
                    }}
                    icon={(<DeleteOutlined />)}
                  />
                </div>
              )}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <div className="p-editPageTemplate_input">
                    <Typography.Text strong>
                      {t('order.products')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`items.${i}.productId`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <DropdownElement
                          type="products"
                          placeholder={t('system.pleaseSelect')}
                          locale="vi"
                          value={value}
                          ids={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="p-editPageTemplate_input">
                    <Typography.Text strong>
                      {t('product.code')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`items.${i}.sizeId`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <Input
                          className="u-mt-8"
                          value={value}
                          readOnly
                          onChange={onChange}
                          size="middle"
                        />
                      )}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className="p-editPageTemplate_input u-mt-16">
                    <Typography.Text strong>
                      {t('product.sizes')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`items.${i}.sizeId`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <DropdownElement
                          type="sizes"
                          placeholder={t('system.pleaseSelect')}
                          locale="vi"
                          value={value}
                          ids={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="p-editPageTemplate_input u-mt-16">
                    <Typography.Text strong>
                      {t('product.colors')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`items.${i}.colorId`}
                      render={({
                        field: { value, onChange },
                      }) => (
                        <DropdownElement
                          type="colors"
                          placeholder={t('system.pleaseSelect')}
                          locale="vi"
                          value={value}
                          ids={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="p-editPageTemplate_input u-mt-16">
                    <Typography.Text strong>
                      {t('product.quantity')}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      {' '}
                      *
                    </Typography.Text>
                    <Controller
                      name={`items.${i}.quantity`}
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
                <Col span={12}>
                  <div className="u-mt-16">
                    <Image src={itemField.thumbnail} preview />
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
          Thêm sản phẩm đặt hàng
        </Button>
      </Space>
    </div>
  );
};

export default NestedOrderItem;
