import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Checkbox, Col, DatePicker, message, Row, Space, Spin, Typography
} from 'antd';
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
import { DropdownElement } from 'common/components/DropdownType';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ModalConfirm from 'common/components/ModalConfirm';
import { createCouponService, getCouponDetailService, updateCouponService } from 'common/services/coupon';
import { CouponData } from 'common/services/coupon/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { renderValue } from 'common/utils/functions';

const couponDetailSchema = yup.object().shape({
  code: yup.string().required('Nhập mã'),
  startDate: yup.string().required('Nhập ngày bắt đầu'),
  endDate: yup.string().required('Nhập ngày kết thúc'),
  discountType: yup.string().required('Chọn loại giảm giá'),
  discountValue: yup.number().required('Nhập giá trị')
});

const CouponDetail: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const method = useForm<CouponData>({
    resolver: yupResolver(couponDetailSchema),
    defaultValues: {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    }
  });

  /* States */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [confirm, setConfirm] = useState<string | undefined>(undefined);

  /* Queries */
  const { data: couponData, isLoading } = useQuery(
    ['getCouponDetail', currentLang, idParams],
    () => {
      if (idParams) {
        return getCouponDetailService(idParams);
      }
      return undefined;
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    'updateCoupon',
    async (data: {
      id: number;
      params: CouponData
    }) => updateCouponService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getCouponDetail', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    'createCoupon',
    createCouponService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.COUPON_MANAGEMENT}`);
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
    if (couponData) {
      method.reset({
        code: couponData.code,
        startDate: couponData.startDate,
        endDate: couponData.endDate,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        isActive: couponData.isActive,
        applyProducts: couponData.applyProducts.map((item) => item.id),
        minPriceApply: couponData.minPriceApply,
        maxValuePromotion: couponData.maxValuePromotion,
        maxQuantityUsed: couponData.maxQuantityUsed
      });
    } else {
      method.reset({});
    }
  }, [couponData, currentLang, method]);

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
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <Card type="inner">
                {/* Tiêu đề  */}
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('coupon.code')}
                        {' '}
                      </Typography.Text>
                      <Typography.Text strong type="danger">
                        *
                      </Typography.Text>
                      <Controller
                        name="code"
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
                            size="middle"
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('coupon.type')}
                        {' '}
                      </Typography.Text>
                      <Typography.Text strong type="danger">
                        *
                      </Typography.Text>
                      <Controller
                        name="discountType"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                        }) => (
                          <DropdownElement
                            options={[{
                              label: 'Giá',
                              value: 'price'
                            }, {
                              label: 'Phần trăm',
                              value: 'percent'
                            }]}
                            placeholder={`${t('system.select')} ${t('coupon.type')}`}
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
                        {t('coupon.discountValue')}
                        {' '}
                      </Typography.Text>
                      <Typography.Text strong type="danger">
                        *
                      </Typography.Text>
                      <Controller
                        name="discountValue"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                          fieldState: { error }
                        }) => (
                          <Input
                            className="u-mt-8"
                            value={value && renderValue(String(value))}
                            onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
                            error={error?.message}
                            size="middle"
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col span={12} style={{ alignSelf: 'center' }}>
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Controller
                        name="isActive"
                        render={({
                          field: { onChange, value, ref },
                        }) => (
                          <div className="u-mt-8">
                            <Checkbox
                              ref={ref}
                              checked={value}
                              onChange={onChange}
                            >
                              {t('coupon.active')}
                            </Checkbox>
                          </div>
                        )}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Typography.Text strong>
                        {t('coupon.startDate')}
                        {' '}
                      </Typography.Text>
                      <Typography.Text strong type="danger">
                        *
                      </Typography.Text>
                      <Controller
                        name="startDate"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                        }) => (
                          <DatePicker
                            size="large"
                            value={moment(value)}
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
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Typography.Text strong>
                        {t('coupon.endDate')}
                        {' '}
                      </Typography.Text>
                      <Typography.Text strong type="danger">
                        *
                      </Typography.Text>
                      <Controller
                        name="endDate"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                        }) => (
                          <DatePicker
                            size="large"
                            value={moment(value)}
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
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Typography.Text strong>
                        {t('coupon.applyProducts')}
                      </Typography.Text>
                      <Controller
                        name="applyProducts"
                        render={({
                          field: { value, onChange },
                        }) => (
                          <DropdownElement
                            type="products"
                            placeholder={t('system.pleaseSelect')}
                            locale="vi"
                            filterParams={String(value)}
                            value={value}
                            onChange={onChange}
                            multiple={{
                              allowClear: true,
                              defaultValue: []
                            }}
                          />
                        )}
                      />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Typography.Text strong>
                        {t('coupon.maxQuantityUsed')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="maxQuantityUsed"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <Input
                            type="number"
                            className="u-mt-8"
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
                        {t('coupon.minPriceApply')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="minPriceApply"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <Input
                            className="u-mt-8"
                            value={value && renderValue(String(value))}
                            onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
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
                        {t('coupon.maxValuePromotion')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="maxValuePromotion"
                        control={method.control}
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <Input
                            className="u-mt-8"
                            value={value && renderValue(String(value))}
                            onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
                            error={error?.message}
                            size="middle"
                          />
                        )}
                      />
                    </div>
                  </Col>
                </Row>
              </Card>
            </Space>
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

export default CouponDetail;
