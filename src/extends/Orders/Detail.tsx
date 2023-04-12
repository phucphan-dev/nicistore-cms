/* eslint-disable import/no-cycle */
/* eslint-disable max-len */
import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Space, Spin, Typography
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';

import NestedOrderItem from './NestedOrderItem';

import { statusOrderDummy } from 'common/assets/dummyData/system';
import { DropdownElement } from 'common/components/DropdownType';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import { StatusOrderLabel } from 'common/components/StatusLabel';
import useDidMount from 'common/hooks/useDidMount';
import { getLocationCitiesService, getLocationDistrictsService, getLocationWardsService } from 'common/services/location';
import {
  createOrderService, getOrderCustomerService, getOrderDetailService, getShippingAddressCustomerService, updateOrderService
} from 'common/services/orders';
import { OrderDataRequest } from 'common/services/orders/types';
import { ROUTE_PATHS } from 'common/utils/constant';

export type OrderDataFormType = {
  customerId: number;
  shippingAddressId: number
} & OrderDataRequest;

const orderDetailSchema = yup.object().shape({
  cityId: yup.number().required('Vui lòng chọn tỉnh / thành phố'),
  districtId: yup.number().required('Vui lòng chọn quận / huyện'),
  wardId: yup.number().required('Vui lòng chọn phường / xã'),
  address: yup.string().required('Vui lòng nhập địa chỉ'),
  name: yup.string().required('Vui lòng nhập họ và tên'),
  phone: yup.string().required('Vui lòng nhập số điện thoại').matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ'),
  email: yup.string().required('Vui lòng nhập lại địa chỉ email').email('Email không hợp lệ'),
});
const defaultValues = {
  status: 0,
  items: [
    {
      productId: undefined,
      sizeId: undefined,
      colorId: undefined,
      quantity: 0,
      code: undefined,
      thumbnail: undefined
    }
  ]
};
const OrderDetail: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const method = useForm<OrderDataFormType>({
    resolver: yupResolver(orderDetailSchema),
    defaultValues
  });
  const watchCustomer = method.watch('customerId');
  const watchShippingAddress = method.watch('shippingAddressId');
  const watchCity = method.watch('cityId');
  const watchDistrict = method.watch('districtId');
  /* States */
  const idParams = Number(searchParams.get('id'));
  const [confirm, setConfirm] = useState<string | undefined>(undefined);

  /* Queries */
  const { mutate: getCitiesMutate, data: cities } = useMutation(
    'getCitiesAction',
    (countryId: number) => getLocationCitiesService(countryId),
  );

  const { mutate: getDistrictsMutate, data: districts } = useMutation(
    'getDistrictsAction',
    (cityId: number) => getLocationDistrictsService(cityId),
  );

  const { mutate: getWardsMutate, data: wards } = useMutation(
    'getWardsAction',
    (districtId: number) => getLocationWardsService(districtId),
  );

  const { data: orderCustomers } = useQuery(
    ['getOrderCustomer'],
    getOrderCustomerService,
    {
      enabled: !idParams
    }
  );

  const { data: shippingAddressCustomer } = useQuery(
    ['shippingAddressCustomer', watchCustomer],
    () => getShippingAddressCustomerService(watchCustomer),
    {
      enabled: !idParams && !!watchCustomer
    }
  );

  const { data: orderDetailData, isLoading } = useQuery(
    ['getOrderDetail', idParams],
    () => {
      if (idParams) {
        return getOrderDetailService(idParams);
      }
      return undefined;
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    'updateOrder',
    async (data: {
      id: number;
      params: OrderDataRequest
    }) => updateOrderService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getOrderDetail', idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    'createOrder',
    createOrderService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.ORDERS_MANAGEMENT}`);
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
    const formData = method.getValues();

    if (idParams) {
      updateMutate({
        id: idParams,
        params: formData
      });
    } else {
      createMutate(formData);
    }
  };

  const changeLanguageAction = async (lang?: string, isSubmit?: boolean) => {
    setConfirm(undefined);
    if (lang) {
      if (isSubmit) {
        await onSubmit();
      }
      setSearchParams({
        id: String(idParams),
        locale: lang,
      }, { replace: true });
    }
  };

  /* Effects */
  useEffect(() => {
    if (orderDetailData) {
      const {
        city, district, ward, address, name, phone, email, status, note, items
      } = orderDetailData;
      const objDefault: OrderDataRequest = {
        cityId: city.id,
        districtId: district.id,
        wardId: ward.id,
        name,
        phone,
        email,
        address,
        note,
        status,
        items: items.map((it) => ({
          productId: it.product.id,
          sizeId: it.size.id,
          colorId: it.color.id,
          quantity: it.quantity,
          code: it.product.code,
          thumbnail: it.product.thumbnail
        }))
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [orderDetailData, method]);

  useDidMount(() => {
    getCitiesMutate(1);
  });

  useEffect(() => {
    if (watchCity) {
      getDistrictsMutate(watchCity);
    }
  }, [getDistrictsMutate, watchCity]);

  useEffect(() => {
    if (watchDistrict) {
      getWardsMutate(watchDistrict);
    }
  }, [getWardsMutate, watchDistrict]);

  useEffect(() => {
    const data = shippingAddressCustomer?.find((item) => item.id === watchShippingAddress);
    if (data) {
      method.setValue('cityId', data.city.id);
      method.setValue('districtId', data.district.id);
      method.setValue('wardId', data.ward.id);
      method.setValue('address', data.address);
      method.setValue('name', data.name);
      method.setValue('phone', data.phone);
    }
  }, [method, shippingAddressCustomer, watchShippingAddress]);

  useEffect(() => {
    const data = orderCustomers?.find((item) => item.id === watchCustomer);
    if (data) {
      method.setValue('email', data.email);
    }
  }, [method, orderCustomers, watchCustomer]);

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
                  {!idParams && (
                    <Card type="inner">
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
                                  options={orderCustomers ? orderCustomers?.map((item) => ({ label: item.fullName || item.email, value: item.id })) : []}
                                  placeholder={`${t('system.select')} ${t('order.customer')}`}
                                  locale="vi"
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </div>
                        </Col>
                        <Col span={12}>
                          <div className="p-editPageTemplate_input">
                            <Typography.Text strong>
                              {t('order.shippingAddress')}
                              {' '}
                            </Typography.Text>
                            <Controller
                              name="shippingAddressId"
                              control={method.control}
                              render={({
                                field: { value, onChange },
                              }) => (
                                <DropdownElement
                                  options={shippingAddressCustomer ? shippingAddressCustomer?.map((item) => ({
                                    label: `${item.city.name}, ${item.district.name}, ${item.ward.name}, ${item.address}`,
                                    value: item.id
                                  })) : []}
                                  placeholder={`${t('system.select')} ${t('order.shippingAddress')}`}
                                  locale="vi"
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  )}
                  <Card type="inner">
                    <Row gutter={16}>
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
                            name="name"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                type="string"
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="middle"
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('order.phone')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
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
                                type="string"
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="middle"
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
                                type="string"
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="middle"
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.city')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="cityId"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DropdownElement
                                options={cities || []}
                                placeholder={`${t('system.select')} ${t('order.city')}`}
                                locale="vi"
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.district')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="districtId"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DropdownElement
                                options={districts || []}
                                placeholder={`${t('system.select')} ${t('order.district')}`}
                                locale="vi"
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.ward')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="wardId"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DropdownElement
                                options={wards || []}
                                placeholder={`${t('system.select')} ${t('order.ward')}`}
                                locale="vi"
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.address')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="address"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                type="string"
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="middle"
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('order.note')}
                          </Typography.Text>
                          <Controller
                            name="note"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                            }) => (
                              <TextArea
                                className="u-mt-8"
                                value={value}
                                onChange={onChange}
                                size="large"
                                rows={6}
                                style={{ minHeight: 50 }}
                              />
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  <NestedOrderItem control={method.control} />
                </Space>
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                {orderDetailData && (
                  <div className="u-mb-16">
                    <StatusOrderLabel status={orderDetailData.status} bigger />
                  </div>
                )}
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
                  createdDate={orderDetailData ? moment(orderDetailData.createdAt).fromNow() : ''}
                  createdBy="Admin"
                  lastUpdated={orderDetailData ? moment(orderDetailData.updatedAt).fromNow() : ''}
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

export default OrderDetail;
