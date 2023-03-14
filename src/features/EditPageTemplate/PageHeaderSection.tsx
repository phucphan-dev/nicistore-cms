import { yupResolver } from '@hookform/resolvers/yup';
import {
  Card,
  Col, Row, Select, Space, Switch, Typography,
} from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  Controller,
  useForm,
  FormProvider,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import StatusLabel from 'common/components/StatusLabel';
import { detailPageHeaderSchema } from 'common/utils/schemas';

export type PageHeaderSectionTypes = {
  sample?: string;
  parent?: number;
  isHome?: boolean;
};

export interface PageHeaderSectionActionRef {
  handleForm: () => Promise<PageHeaderSectionTypes | undefined>;
  handleSetDefault: (values: PageHeaderSectionTypes) => void;
  handleResetForm: () => void;
  isFormDirty: () => boolean;
}

interface PageHeaderSectionProps {
  status: number;
  sampleOptions: OptionType[];
  parentPageOptions: OptionType[];
  handleChangeTemplate: (code: string) => void;
}

const PageHeaderSection = forwardRef<PageHeaderSectionActionRef, PageHeaderSectionProps>(({
  status,
  sampleOptions,
  parentPageOptions,
  handleChangeTemplate,
}, ref) => {
  const { t } = useTranslation();
  const method = useForm<PageHeaderSectionTypes>({
    resolver: yupResolver(detailPageHeaderSchema),
    mode: 'onChange',
    defaultValues: {
      sample: undefined,
      parent: undefined,
      isHome: false,
    }
  });

  const { isDirty } = method.formState;

  const template = useWatch<PageHeaderSectionTypes, 'sample'>({
    name: 'sample',
    control: method.control,
  });
  useImperativeHandle(ref, () => ({
    handleForm: async () => {
      const result = await method.trigger('sample');
      if (result) {
        return method.getValues();
      }
      return undefined;
    },
    handleSetDefault: (value) => {
      method.setValue('sample', value.sample);
      method.setValue('parent', value.parent);
      method.setValue('isHome', value.isHome);
    },
    handleResetForm: () => method.reset(),
    isFormDirty: () => isDirty
  }));
  useEffect(() => {
    if (template) {
      handleChangeTemplate(template);
    }
  }, [handleChangeTemplate, template]);

  return (
    <>
      <StatusLabel status={status} bigger />
      <div className="u-mt-16">
        <Card>
          <FormProvider<PageHeaderSectionTypes> {...method}>
            <form noValidate>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Row>
                  <Col span={24}>
                    <Typography.Text strong>
                      {t('system.sample')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="sample"
                      control={method.control}
                      render={({
                        field,
                        fieldState: { error }
                      }) => (
                        <>
                          <Select
                            className="u-mt-8"
                            size="large"
                            style={{ width: '100%' }}
                            placeholder="---"
                            onChange={field.onChange}
                            value={field.value}
                            status={error?.message ? 'error' : undefined}
                          >
                            {
                              sampleOptions.map((val, idx) => (
                                <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                  {val.label}
                                </Select.Option>
                              ))
                            }
                          </Select>
                          {error && (
                            <span
                              className="a-input_errorMessage"
                            >
                              {error.message}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={16}>
                    <Typography.Text strong>
                      {t('system.parent')}
                    </Typography.Text>
                    <Controller
                      name="parent"
                      control={method.control}
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
                            parentPageOptions.map((val, idx) => (
                              <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                {val.label}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                  </Col>
                  <Col span={8}>
                    <Typography.Text strong>
                      {t('system.homepage')}
                    </Typography.Text>
                    {' '}
                    <div className="u-mt-8">
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
                    </div>
                  </Col>
                </Row>
              </Space>
            </form>
          </FormProvider>
        </Card>
      </div>
    </>
  );
});

export default PageHeaderSection;
