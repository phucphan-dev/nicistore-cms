import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Space, Spin, Typography
} from 'antd';
import moment from 'moment';
import React, {
  useEffect,
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import {
  useMutation, useQuery, useQueryClient
} from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import Editor from 'common/components/Editor';
import ErrorText from 'common/components/ErrorText';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import { getEmailTemplateService, updateEmailTemplateService } from 'common/services/emailTemplates';
import { UpdateEmailTemplateParams } from 'common/services/emailTemplates/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { updateEmailTemplateSchema } from 'common/utils/schemas';

export type EmailTemplateFormTypes = {
  code: string;
  name: string;
  subject: string;
  content: string;
};

const defaultValues = {
  code: '',
  name: '',
  subject: '',
  content: '',
};

const EmailTemplateDetail: React.FC<ActiveRoles> = ({ roleUpdate }) => {
  /* Hooks */
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* States */
  const idParams = Number(searchParams.get('id'));

  /* React-hook-form */
  const method = useForm<EmailTemplateFormTypes>({
    resolver: yupResolver(updateEmailTemplateSchema),
    defaultValues
  });

  /* Queries */
  const { data: detailData, isLoading } = useQuery(
    ['emailTemplate-detail', idParams],
    () => getEmailTemplateService({ id: idParams }),
    {
      enabled: !!idParams
    }
  );

  const { mutate: updateEmailTemplateMutate, isLoading: updateLoading } = useMutation(
    ['emailTemplate-update', idParams],
    async (params: UpdateEmailTemplateParams) => updateEmailTemplateService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['emailTemplate-detail', idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  /* Functions */
  const onSubmit = async () => {
    const formData = method.getValues();
    updateEmailTemplateMutate({
      id: idParams,
      name: formData.name,
      subject: formData.subject,
      content: formData.content,
    });
  };

  /* Effects */
  useEffect(() => {
    if (detailData) {
      const objDefault = {
        code: detailData.data.code,
        name: detailData.data.name,
        subject: detailData.data.subject,
        content: detailData.data.content,
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [detailData, method]);

  useEffect(() => {
    if (!idParams) {
      navigate(`${ROUTE_PATHS.EMAIL_TEMPLATE_MANAGEMENT}`);
    }
  }, [idParams, navigate]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('emailTemplate.detail')}
        rightHeader={(
          <Space size={16}>
            <Button
              type="primary"
              disabled={(Boolean(idParams) && !roleUpdate)}
              loading={updateLoading}
              onClick={method.handleSubmit(onSubmit)}
            >
              <SaveOutlined />
              {t('system.save')}
            </Button>
          </Space>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Spin size="large" spinning={updateLoading || isLoading}>
          <FormProvider {...method}>
            <Row gutter={16}>
              <Col xxl={18} xl={16} lg={16}>
                <Card type="inner">
                  <div className="site-card-border-less-wrapper">
                    <Space direction="vertical" size={12} style={{ width: '100%' }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Typography.Text strong>
                            {t('emailTemplate.code')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="code"
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                disabled
                                className="u-mt-8"
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                        </Col>
                        <Col span={12}>
                          <Typography.Text strong>
                            {t('emailTemplate.name')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="name"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                        </Col>
                      </Row>
                      <div>
                        <Typography.Text strong>
                          {t('emailTemplate.subject')}
                          {' '}
                        </Typography.Text>
                        <Typography.Text strong type="danger">
                          *
                        </Typography.Text>
                        <Controller
                          name="subject"
                          render={({
                            field: { value, onChange },
                            fieldState: { error },
                          }) => (
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
                      <div>
                        <Typography.Text strong>
                          {t('emailTemplate.content')}
                          {' '}
                        </Typography.Text>
                        <Typography.Text strong type="danger">
                          *
                        </Typography.Text>
                        <Controller
                          name="content"
                          render={({
                            field: { value, onChange },
                            fieldState: { error },
                          }) => (
                            <>
                              <Editor
                                value={value || ''}
                                handleChange={(_event: any, editor: any) => {
                                  const data = editor.getData();
                                  onChange(data);
                                }}
                              />
                              {
                                error && (
                                  <ErrorText>
                                    {error.message}
                                  </ErrorText>
                                )
                              }
                            </>
                          )}
                        />
                      </div>
                    </Space>
                  </div>
                </Card>
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <ManagementInfo
                  createdDate={detailData ? moment(detailData.data.createdAt).fromNow() : ''}
                  createdBy={detailData?.creator?.name || ''}
                  lastUpdated={detailData ? moment(detailData.data.updatedAt).fromNow() : ''}
                  lastUpdatedBy={detailData?.updater?.name || ''}
                />
                <div className="u-mt-16">
                  <Card className="p-emailTemplateDetail_markdown">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    >
                      {detailData?.markdown || ''}
                    </ReactMarkdown>
                  </Card>
                </div>
              </Col>
            </Row>
          </FormProvider>
        </Spin>
      </div>
    </>
  );
};

export default EmailTemplateDetail;
