import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Space, Spin, Typography
} from 'antd';
import moment from 'moment';
import React, {
  useEffect, useMemo, useRef, useState
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
import ModalConfirm from 'common/components/ModalConfirm';
import SeoSection, { SeoSectionActionProps } from 'common/components/SeoSection';
import { SeoFormTypes } from 'common/components/SeoSection/types';
import StatusLabel from 'common/components/StatusLabel';
import { createProductCategoryService, getProductCategoryByIdService, updateProductCategoryByIdService } from 'common/services/products';
import { CreateUpdateProductCategoryTypes } from 'common/services/products/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { generateSlug } from 'common/utils/functions';

type ProductCategoriesFormTypes = {
  status: number;
  displayOrder: number;
  parentId?: number;
  name: string;
  slug: string;
};

const defaultValues = {
  status: 1,
  displayOrder: 1,
  name: '',
  slug: '',
};

const productCategoriesDetailSchema = yup.object().shape({
  displayOrder: yup.number().required('Nhập thứ tự hiển thị'),
  name: yup.string().required('Nhập tiêu đề'),
  slug: yup.string().required('Nhập đường dẫn'),
  status: yup.number().required('Chọn trạng thái'),
});

const ProductCategoriesDetail: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const method = useForm<ProductCategoriesFormTypes>({
    resolver: yupResolver(productCategoriesDetailSchema),
    defaultValues
  });
  const seoSectionRef = useRef<SeoSectionActionProps>(null);

  /* States */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const [status, setStatus] = useState<number>(1);
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [confirm, setConfirm] = useState<string | undefined>(undefined);

  /* Queries */
  const { data: productCategoryData, isLoading } = useQuery(
    ['getProductCategoryDetail', currentLang, idParams],
    () => {
      if (idParams) {
        return getProductCategoryByIdService(idParams);
      }
      return undefined;
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    'updateProductCategory',
    async (data: {
      id: number;
      params: CreateUpdateProductCategoryTypes
    }) => updateProductCategoryByIdService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getProductCategoryDetail', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    'createProductCategory',
    createProductCategoryService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.PRODUCT_CATEGORIES_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  /* Variables */
  const { isDirty } = method.formState;
  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!productCategoryData) {
      return undefined;
    }
    const seoData = productCategoryData.seoData && productCategoryData.seoData[`${currentLang}`];
    return {
      seoTitle: seoData?.title || '',
      seoIntro: seoData?.description || '',
      seoKeyword: seoData?.keywords || '',
    } as SeoFormTypes;
  }, [currentLang, productCategoryData]);

  /* Functions */
  const onSubmit = async () => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const dataSeoForm = await seoSectionRef.current?.handleForm();

    const params: CreateUpdateProductCategoryTypes = {
      display_order: formData.displayOrder,
      parent_id: formData.parentId,
      status: formData.status,
      translations: {
        [currentLang]: {
          categoryData: {
            name: formData.name,
            slug: formData.slug,
          },
        }
      },
      seoData: {
        [currentLang]: {
          title: dataSeoForm?.seoTitle,
          description: dataSeoForm?.seoIntro,
          keywords: dataSeoForm?.seoKeyword,
        }
      },
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

  const handleChangeLang = async (lang: LanguageCodeTypes) => {
    if (isDirty) {
      setConfirm(lang);
    } else changeLanguageAction(lang);
  };

  /* Effects */
  useEffect(() => {
    if (productCategoryData && productCategoryData.translations[currentLang]) {
      setStatus(productCategoryData.categoryData.status);
      const {
        name, slug,
      } = productCategoryData.translations[currentLang];
      const objDefault: ProductCategoriesFormTypes = {
        name,
        slug,
        displayOrder: 1,
        parentId: productCategoryData.categoryData.parentId,
        status: productCategoryData.categoryData.status,
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [productCategoryData, currentLang, method]);

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
                                  if (!idParams
                                    || !productCategoryData?.translations[currentLang]?.slug) {
                                    method.setValue('slug', generateSlug(e.currentTarget.value));
                                  }
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
                            {t('system.slug')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="slug"
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
                            name="parentId"
                            control={method.control}
                            render={({ field }) => (
                              <DropdownElement
                                type="faqCategory"
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
                                size="large"
                              />
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Space>
                <SeoSection
                  canCreateComment={false}
                  defaultValues={defaultValueSEO}
                  ref={seoSectionRef}
                />
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <div className="u-mb-16">
                  {status && <StatusLabel status={status} bigger />}
                </div>
                <Card className="u-mb-16">
                  <Space direction="vertical" size={16} style={{ width: '100%' }}>
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
                  </Space>
                </Card>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={productCategoryData ? moment(productCategoryData.categoryData.createdAt).fromNow() : ''}
                  createdBy="Admin"
                  lastUpdated={productCategoryData ? moment(productCategoryData.categoryData.updatedAt).fromNow() : ''}
                  lastUpdatedBy="Admin"
                  languageList={languageOptions}
                  currentLang={currentLang}
                  handleChangeLang={
                    (value) => value && handleChangeLang(value as LanguageCodeTypes)
                  }
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

export default ProductCategoriesDetail;
