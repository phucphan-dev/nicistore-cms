import {
  Button, Select, Space, Typography
} from 'antd';
import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import { MenuGenerationFormTypes } from './types';

import { useAppSelector } from 'app/store';
import ErrorText from 'common/components/ErrorText';
import Form from 'common/components/Form';
import Input from 'common/components/Input';
import getDropdownCodeDataService from 'common/services/noPermission';
import { TARGET_LIST_OPTIONS } from 'common/utils/constant';

const { Option } = Select;

interface MenuGenerationProps {
  type: string;
  handleSubmit: (data: MenuGenerationFormTypes) => void;
}

const MenuGeneration: React.FC<MenuGenerationProps> = ({
  type,
  handleSubmit,
}) => {
  /* Selectors */
  const { defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  /* Hooks */
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';

  /* React-hook-form */
  const method = useForm<MenuGenerationFormTypes>({
    defaultValues: {
      referenceLink: undefined,
      title: '',
      url: '',
      type,
      target: TARGET_LIST_OPTIONS[0].value as number
    }
  });

  const { data: dropdownCodeBlockData } = useQuery(
    ['getDropdownCodeBlock', { localeParams, type }],
    async () => getDropdownCodeDataService({
      type,
      locale: localeParams
    }),
    {
      enabled: type !== 'customLink',
    }
  );

  /* Functions */
  const onSubmit = (data: MenuGenerationFormTypes) => {
    handleSubmit(data);
    method.reset();
  };

  /* Datas */
  const optionList = useMemo(() => {
    if (dropdownCodeBlockData?.data) {
      return dropdownCodeBlockData.data.map((ele) => ({
        label: ele.text,
        value: ele.id,
      }));
    }
    return [];
  }, [dropdownCodeBlockData]);

  return (
    <Form method={method} submitForm={onSubmit}>
      {
        type !== 'customLink' ? (
          <Space size={8} style={{ width: '100%' }} direction="vertical">
            <Typography.Text style={{ fontWeight: 700 }}>
              {t('system.title')}
              {' '}
              <Typography.Text strong type="danger">
                *
              </Typography.Text>
            </Typography.Text>
            <Controller
              name="referenceLink"
              rules={{
                validate: (value) => !!value || 'Tiêu đề là bắt buộc'
              }}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="---"
                    size="large"
                    value={field.value}
                    onChange={field.onChange}
                    labelInValue
                  >
                    {
                      optionList.map((item, index) => (
                        <Option value={item.value} key={`option-${index.toString()}`}>
                          {item.label}
                        </Option>
                      ))
                    }
                  </Select>
                  {
                    fieldState.error
                    && (
                      <ErrorText>
                        {fieldState.error.message}
                      </ErrorText>
                    )
                  }
                </>
              )}
            />
          </Space>
        ) : (
          <>
            <Space size={8} style={{ width: '100%' }} direction="vertical">
              <Typography.Text style={{ fontWeight: 700 }}>
                {t('system.title')}
                {' '}
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
              </Typography.Text>
              <Controller
                name="title"
                rules={{
                  validate: (value) => value !== '' || 'Tiêu đề là bắt buộc'
                }}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Space>
            <Space size={8} style={{ width: '100%' }} direction="vertical">
              <Typography.Text style={{ fontWeight: 700 }}>
                URL
              </Typography.Text>
              <Controller
                name="url"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Space>
          </>
        )
      }
      <Space size={8} style={{ width: '100%' }} className="u-mt-8" direction="vertical">
        <Typography.Text style={{ fontWeight: 700 }}>
          Target
        </Typography.Text>
        <Controller
          name="target"
          render={({ field, fieldState }) => (
            <>
              <Select
                size="large"
                style={{ width: '100%' }}
                placeholder="---"
                value={field.value}
                onChange={field.onChange}
                defaultValue={TARGET_LIST_OPTIONS[0].value}
              >
                {
                  TARGET_LIST_OPTIONS.map((item, index) => (
                    <Option value={item.value} key={`option-${index.toString()}`}>
                      {item.label}
                    </Option>
                  ))
                }
              </Select>
              {
                fieldState.error
                && (
                  <ErrorText>
                    {fieldState.error.message}
                  </ErrorText>
                )
              }
            </>
          )}
        />
      </Space>
      <Space size={12} style={{ width: '100%' }} className="u-mt-8" direction="vertical">
        <Button size="large" type="primary" htmlType="submit">
          {t('menu.createLink')}
        </Button>
      </Space>
    </Form>
  );
};

export default MenuGeneration;
