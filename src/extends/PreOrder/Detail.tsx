import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, DatePicker, Image, message, Row, Space, Spin, Typography
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, {
  useEffect, useState
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import { useAppSelector } from 'app/store';
import { statusOrderDummy } from 'common/assets/dummyData/system';
import { DropdownElement } from 'common/components/DropdownType';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import SelectFile from 'common/components/SelectFile';
import { createPreOrderService, getPreOrderByIdService, updatePreOrderByIdService } from 'common/services/preOrder';
import { PreOrderDataRequest } from 'common/services/preOrder/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { getImageURL, renderValue } from 'common/utils/functions';

const preOrderSchema = yup.object().shape({
  email: yup.string().required('Vui lòng nhập lại địa chỉ email').email('Email không hợp lệ'),
  fullname: yup.string().required('Nhập họ và tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
});

const PreOrderDetail: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const method = useForm<PreOrderDataRequest>({
    resolver: yupResolver(preOrderSchema),
  });

  /* States */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [confirm, setConfirm] = useState<string | undefined>(undefined);

  /* Queries */
  const { data: preOrderData, isLoading } = useQuery(
    ['getPreOrder', currentLang, idParams],
    () => {
      if (idParams) {
        return getPreOrderByIdService(idParams);
      }
      return undefined;
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    'updateCustomer',
    async (data: {
      id: number;
      params: PreOrderDataRequest
    }) => updatePreOrderByIdService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getPreOrder', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    'createPreOrder',
    createPreOrderService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.PREORDER_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  /* Functions */
  const onSubmit = async () => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const params = method.getValues();

    if (idParams) {
      updateMutate({
        id: idParams,
        params
      });
    } else {
      createMutate(params);
    }
  };

  const changeLanguageAction = async (lang?: string, isSubmit?: boolean) => {
    setConfirm(undefined);
    if (lang) {
      if (isSubmit) {
        await onSubmit();
      }
      setCurrentLang(lang as LanguageCodeTypes);
      setSearchParams({
        id: String(idParams),
        locale: lang,
      }, { replace: true });
    }
  };

  /* Effects */
  useEffect(() => {
    if (preOrderData) {
      method.reset({ ...preOrderData });
    } else {
      method.reset({});
    }
  }, [preOrderData, currentLang, method]);

  return (
    <>
      <HeaderPage
        fixed
        title={idParams ? t('system.edit') : t('system.create')}
        rightHeader={(
          <Button
            type="primary"
            loading={updateLoading || createLoading}
            onClick={method.handleSubmit(onSubmit)}
          >
            <SaveOutlined />
            {t('system.save')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Spin
          size="large"
          spinning={updateLoading || isLoading || createLoading}
        >
          <FormProvider {...method}>
            <Row gutter={16}>
              <Col xxl={18} xl={16} lg={16}>
                <Space direction="vertical" size={20} style={{ width: '100%' }}>
                  <Card type="inner">
                    {/* Tiêu đề  */}
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('order.customer')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="customerId"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DropdownElement
                                type="users"
                                placeholder={t('system.pleaseSelect')}
                                locale="vi"
                                value={value}
                                ids={String(value)}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('order.name')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="fullname"
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
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.phone')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="phone"
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
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('system.email')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="email"
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
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  {preOrderData?.productImages && preOrderData?.productImages.length > 0 && (
                    <Card type="inner">
                      <Typography.Text strong>
                        {t('order.customerImages')}
                        {' '}
                      </Typography.Text>
                      <div className="p-editPageTemplate_images u-mt-32">
                        {preOrderData?.productImages.map((item) => (
                          <Image src={getImageURL(item)} preview />
                        ))}
                      </div>
                    </Card>
                  )}
                  <Card type="inner">
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('order.price')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="price"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                value={renderValue(String(value))}
                                onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                        </div>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.deposit')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="deposit"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                value={renderValue(String(value))}
                                onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                        </div>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.orderedAt')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="orderedAt"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DatePicker
                                size="large"
                                value={value ? moment(value) : undefined}
                                onChange={onChange}
                                format="DD/MM/YYYY HH:mm"
                                defaultValue={moment()}
                                showTime
                                style={{ width: '100%' }}
                              />
                            )}
                          />
                        </div>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.depositedAt')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="depositedAt"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DatePicker
                                size="large"
                                value={value ? moment(value) : undefined}
                                onChange={onChange}
                                format="DD/MM/YYYY HH:mm"
                                defaultValue={moment()}
                                showTime
                                style={{ width: '100%' }}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <Controller
                          name="depositImage"
                          render={({
                            field: { value, onChange },
                            fieldState
                          }) => (
                            <>
                              <SelectFile
                                value={value}
                                name="depositImage"
                                handleSelect={(url) => {
                                  onChange(url);
                                }}
                                handleDelete={() => onChange(undefined)}
                                title={(
                                  <Typography.Text strong>
                                    {t('order.depositImage')}
                                    {' '}
                                  </Typography.Text>
                                )}
                              />
                              {fieldState.error && (
                                <span
                                  className="a-input_errorMessage"
                                >
                                  {fieldState.error.message}
                                </span>
                              )}
                            </>
                          )}
                        />
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.guestNote')}
                          </Typography.Text>
                          <Controller
                            name="guestNote"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <TextArea
                                className="u-mt-8"
                                value={value}
                                onChange={onChange}
                                size="large"
                                rows={2}
                                style={{ minHeight: 50 }}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.adminNote')}
                          </Typography.Text>
                          <Controller
                            name="adminNote"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <TextArea
                                className="u-mt-8"
                                value={value}
                                onChange={onChange}
                                size="large"
                                rows={2}
                                style={{ minHeight: 50 }}
                              />
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Space>
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <Card className="u-mb-16">
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('system.status')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="status"
                        control={method.control}
                        render={({ field }) => (
                          <DropdownElement
                            options={statusOrderDummy}
                            placeholder={`${t('system.select')} ${t('system.status')}`}
                            locale="vi"
                            filterParams={idParams.toString()}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </Space>
                </Card>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={preOrderData ? moment(preOrderData.createdAt).fromNow() : ''}
                  createdBy="Admin"
                  lastUpdated={preOrderData ? moment(preOrderData.updatedAt).fromNow() : ''}
                  lastUpdatedBy="Admin"
                />
                {/* <SeoPlugin
                  commentList={commentsList}
                  handleSeeMoreComment={handleLoadMoreComments}
                  handleOpenPreview={() => seoSectionRef.current?.handleOpenBrowserPreview()}
                  handleOpenSocialPreview={() => seoSectionRef.current?.handleOpenSocialPreview()}
                /> */}
              </Col>
            </Row>
          </FormProvider>
        </Spin>
        <ModalConfirm
          isShow={!!confirm}
          handleCancel={() => setConfirm(undefined)}
          handleConfirm={() => changeLanguageAction(confirm)}
          handleClose={() => setConfirm(undefined)}
        >
          {t('message.confirmSave')}
        </ModalConfirm>
      </div>
    </>
  );
};

export default PreOrderDetail;
