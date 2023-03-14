import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Space,
  Typography,
  Button,
  Divider,
  Collapse,
  Select,
  Modal,
} from 'antd';
import React, {
  useCallback,
} from 'react';
import {
  Controller,
  useFieldArray, UseFormReturn, useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { SeoFormTypes } from './types';

import Input from 'common/components/Input';
import SelectFile from 'common/components/SelectFile';

const mediaSocialData = {
  ogTitle: '',
  ogType: null,
  ogImage: '',
  ogDescription: '',
};

interface MediaSocialFormProps {
  method: UseFormReturn<SeoFormTypes>;
  socialList?: OptionType[];
}

const MediaSocialForm: React.FC<MediaSocialFormProps> = ({
  method,
  socialList,
}) => {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control: method.control,
    name: 'mediaSocial',
  });
  const dataFields = useWatch({ control: method.control, name: 'mediaSocial' });

  const getSocialLabel = useCallback((idx: number) => {
    const watchMediaSocial = method.watch('mediaSocial');
    if (socialList) {
      return socialList?.find((item) => item.value === watchMediaSocial[idx]?.ogType)?.label;
    }
    return '';
  }, [socialList, method]);

  return (
    <div className="seoSection_mediaSocial">
      <Typography.Paragraph strong>
        {`MetaSocial (${fields.length})`}
      </Typography.Paragraph>
      <Collapse style={{ padding: '2px', background: 'none' }}>
        {fields && fields.length > 0 && fields.map((arrayItem, index) => (
          <Collapse.Panel
            header={(
              <div className="p-editPageTemplate_blockHeader">
                <Typography.Title level={5} style={{ marginBottom: 0 }}>
                  {getSocialLabel(index) || 'Social'}
                </Typography.Title>
                <Button
                  type="text"
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
                      onOk: () => remove(index),
                    });
                  }}
                  icon={(<DeleteOutlined />)}
                />
              </div>
            )}
            key={`${arrayItem.id}-panel`}
          >
            <div className="t-detailpage_upload">
              <Controller
                name={`mediaSocial.${index}.ogImage`}
                render={({
                  field: { value, onChange },
                }) => (
                  <SelectFile
                    title={t('system.image')}
                    value={value}
                    name={`mediaSocial.${index}.ogImage`}
                    handleSelect={(url) => onChange(url)}
                    handleDelete={() => onChange(undefined)}
                  />
                )}
              />
            </div>
            <div className="t-detailpage_input u-mt-16">
              <Typography.Text strong>
                {t('system.title')}
              </Typography.Text>
              <Controller
                name={`mediaSocial.${index}.ogTitle`}
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
            <div className="t-detailpage_input u-mt-16">
              <Typography.Text strong>
                {t('system.description')}
              </Typography.Text>
              <Controller
                name={`mediaSocial.${index}.ogDescription`}
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
            <div className="t-detailpage_input u-mt-16">
              <Typography.Text strong>
                {t('system.type')}
              </Typography.Text>
              <Controller
                name={`mediaSocial.${index}.ogType`}
                render={({
                  field,
                  fieldState: { error }
                }) => (
                  <Select
                    size="large"
                    className="u-mt-8"
                    style={{ width: '100%' }}
                    placeholder="---"
                    onChange={field.onChange}
                    value={field.value}
                    status={error?.message ? 'error' : undefined}
                  >
                    {
                      socialList?.map((val, idx) => (
                        <Select.Option disabled={dataFields.find((ele) => ele.ogType === val.value)} value={val.value} key={`option-${idx.toString()}`}>
                          {val.label}
                        </Select.Option>
                      ))
                    }
                  </Select>
                )}
              />
            </div>
            <Divider />
          </Collapse.Panel>
        ))}
      </Collapse>
      <Space
        direction="horizontal"
        size={12}
        style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
      >
        <Button
          size="large"
          type="primary"
          icon={(<PlusOutlined />)}
          onClick={() => {
            append(mediaSocialData);
          }}
        >
          {t('system.addNew')}
        </Button>
      </Space>

    </div>
  );
};

export default MediaSocialForm;
