import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Space, Spin, Typography
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
import { statusDummy } from 'common/assets/dummyData/system';
import { DropdownElement } from 'common/components/DropdownType';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import StatusLabel from 'common/components/StatusLabel';
import { createProductSizeService, getProductSizeByIdService, updateProductSizeByIdService } from 'common/services/products';
import { CreateUpdateProductSizeTypes } from 'common/services/products/types';
import { ROUTE_PATHS } from 'common/utils/constant';

type ProductSizesFormTypes = {
  status: number;
  displayOrder: number;
  name: string;
  code: string;
};

const defaultValues = {
  status: 1,
  displayOrder: 1,
  name: '',
  code: '',
};

const productSizesDetailSchema = yup.object().shape({
  displayOrder: yup.number().required('Nhập thứ tự hiển thị'),
  name: yup.string().required('Nhập tiêu đề'),
  code: yup.string().required('Nhập mã'),
  status: yup.number().required('Chọn trạng thái'),
});

const ProductSizesDetail: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const method = useForm<ProductSizesFormTypes>({
    resolver: yupResolver(productSizesDetailSchema),
    defaultValues
  });

  /* States */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const [status, setStatus] = useState<number>(1);
  const [currentLang] = useState<string>(
    localeParams
  );

  /* Queries */
  const { data: productSizeData, isLoading } = useQuery(
    ['getProductSizeDetail', idParams],
    () => {
      if (idParams) {
        return getProductSizeByIdService(idParams);
      }
      return undefined;
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    'updateProductSize',
    async (data: {
      id: number;
      params: CreateUpdateProductSizeTypes
    }) => updateProductSizeByIdService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getProductSizeDetail', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    'createProductSize',
    createProductSizeService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.PRODUCT_SIZES_MANAGEMENT}`);
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

    const params: CreateUpdateProductSizeTypes = {
      displayOrder: formData.displayOrder,
      status: formData.status,
      code: formData.code,
      name: formData.name
    };

    if (idParams) {
      updateMutate({
        id: idParams,
        params
      });
    } else {
      createMutate(params);
    }
  };

  /* Effects */
  useEffect(() => {
    if (productSizeData) {
      setStatus(productSizeData.status);
      const {
        name, code, displayOrder
      } = productSizeData;
      const objDefault: ProductSizesFormTypes = {
        name,
        code,
        displayOrder,
        status: productSizeData.status,
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [productSizeData, currentLang, method]);

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
                            {t('system.title')}
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
                                onChange={(e) => {
                                  onChange(e);
                                }}
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('system.code')}
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
                                size="large"
                              />
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  <Card type="inner">
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('faqCategoryDetail.parentCategory')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="status"
                            control={method.control}
                            render={({ field }) => (
                              <DropdownElement
                                options={statusDummy}
                                placeholder={`${t('system.select')} ${t('faqCategoryDetail.parentCategory')}`}
                                locale={currentLang}
                                filterParams={idParams.toString()}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('newsDetail.displayOrder')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="displayOrder"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                type="number"
                                value={value}
                                onChange={onChange}
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
                {/* <SeoSection
                  canCreateComment={false}
                  defaultValues={defaultValueSEO}
                  ref={seoSectionRef}
                /> */}
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <div className="u-mb-16">
                  {status && <StatusLabel status={status} bigger />}
                </div>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={productSizeData ? moment(productSizeData.createdAt).fromNow() : ''}
                  createdBy="Admin"
                  lastUpdated={productSizeData ? moment(productSizeData.updatedAt).fromNow() : ''}
                  lastUpdatedBy="Admin"
                // languageList={languageOptions}
                // currentLang={currentLang}
                // handleChangeLang={
                //   (value) => value && handleChangeLang(value as LanguageCodeTypes)
                // }
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
      </div>
    </>
  );
};

export default ProductSizesDetail;
