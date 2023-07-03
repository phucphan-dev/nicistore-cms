/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/naming-convention */
import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Checkbox, Col, message, Row, Space, Spin, Typography
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

import ColorSizeNestedArray from './NestedProductColorSize';

import { useAppSelector } from 'app/store';
import { statusDummy } from 'common/assets/dummyData/system';
import { DropdownElement } from 'common/components/DropdownType';
import Editor, { SimpleEditor } from 'common/components/Editor';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import SelectFile, { SelectMultipleFile } from 'common/components/SelectFile';
import SeoSection, { SeoSectionActionProps } from 'common/components/SeoSection';
import { SeoFormTypes } from 'common/components/SeoSection/types';
import StatusLabel from 'common/components/StatusLabel';
import { createProductService, getProductByIdService, updateProductByIdService, } from 'common/services/products';
import { CreateUpdateProductTypes, ProductColorSizeTypes } from 'common/services/products/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { generateSlug, renderValue } from 'common/utils/functions';

export type ProductFormTypes = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  status: number;
  displayOrder: number;
  code: string;
  featured: boolean;
  isBestSeller: boolean;
  totalInit: number;
  thumbnail: string;
  galleries: SelectImageData[];
  price: number;
  priceInit: number;
  salePercent: number;
  categories: number[];
  colorSize: ProductColorSizeTypes[];
  relatedIds: number[];
};

const defaultValues: ProductFormTypes = {
  name: '',
  slug: '',
  shortDescription: '',
  description: '',
  status: 1,
  displayOrder: 1,
  code: '',
  featured: false,
  isBestSeller: false,
  totalInit: 0,
  thumbnail: '',
  galleries: [],
  price: 0,
  priceInit: 0,
  salePercent: 0,
  categories: [],
  colorSize: [],
  relatedIds: []
};

const productDetailSchema = yup.object().shape({
  name: yup.string().required('Nhập tiêu đề'),
  slug: yup.string().required('Nhập đường dẫn'),
  shortDescription: yup.string().required('Nhập mô tả ngắn'),
  description: yup.string().required('Nhập mô tả'),
  status: yup.number().required('Chọn trạng thái'),
  displayOrder: yup.number().required('Nhập thứ tự hiển thị'),
  code: yup.string().required('Nhập mã sản phẩm'),
  totalInit: yup.number().required('Nhập số lượng nhập hàng'),
  thumbnail: yup.string().required('Chọn hình đại diện'),
  price: yup.number().required('Nhập giá'),
  priceInit: yup.number().required('Nhập giá nhập hàng'),
});

const ProductDetail: React.FC = () => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const method = useForm<ProductFormTypes>({
    resolver: yupResolver(productDetailSchema),
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

  const colorSizeWatch = method.watch('colorSize');

  /* Queries */
  const { data: productData, isLoading } = useQuery(
    ['getProductDetail', currentLang, idParams],
    () => {
      if (idParams) {
        return getProductByIdService(idParams);
      }
      return undefined;
    }
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    'updateProduct',
    async (data: {
      id: number;
      params: CreateUpdateProductTypes
    }) => updateProductByIdService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getProductDetail', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createMutate, isLoading: createLoading } = useMutation(
    'createProduct',
    createProductService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.PRODUCT_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  /* Variables */
  const { isDirty } = method.formState;
  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!productData) {
      return undefined;
    }
    const seoData = productData.seoData && productData.seoData[`${currentLang}`];
    return {
      seoTitle: seoData?.title || '',
      seoIntro: seoData?.description || '',
      ogImage: seoData?.image || '',
      seoKeyword: seoData?.keywords || '',
    } as SeoFormTypes;
  }, [currentLang, productData]);

  /* Functions */
  const onSubmit = async () => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const dataSeoForm = await seoSectionRef.current?.handleForm();

    const params: CreateUpdateProductTypes = {
      status: formData.status,
      displayOrder: Number(formData.displayOrder),
      code: formData.code,
      featured: formData.featured,
      isBestSeller: formData.isBestSeller,
      totalInit: Number(formData.totalInit),
      thumbnail: formData.thumbnail,
      galleries: formData.galleries,
      price: formData.price,
      priceInit: formData.priceInit,
      salePercent: Number(formData.salePercent),
      categories: formData.categories,
      colorSize: formData.colorSize,
      relatedIds: formData.relatedIds,
      translations: {
        [currentLang]: {
          productData: {
            name: formData.name,
            slug: formData.slug,
            shortDescription: formData.shortDescription,
            description: formData.description
          },
        }
      },
      seo: {
        [currentLang]: {
          title: dataSeoForm?.seoTitle,
          description: dataSeoForm?.seoIntro,
          image: dataSeoForm?.ogImage,
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
    if (productData && productData.translations[currentLang]) {
      setStatus(productData.productData.status);
      const {
        name, slug, shortDescription, description
      } = productData.translations[currentLang];
      const {
        displayOrder, code, totalInit,
        galleries, thumbnail, price, salePercent, priceInit, featured, isBestSeller
      } = productData.productData;
      const objDefault: ProductFormTypes = {
        name,
        slug,
        shortDescription,
        description,
        status: productData.productData.status,
        displayOrder,
        code,
        featured,
        isBestSeller,
        totalInit,
        thumbnail,
        galleries,
        price,
        priceInit,
        salePercent,
        categories: productData.categories.map((item) => item.id),
        colorSize: productData.colorSize.map((item) => (
          {
            colorId: item.color.id, sizeId: item.size.id, quantity: item.quantity, image: item.image
          })),
        relatedIds: productData.relatedIds
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [productData, currentLang, method]);

  useEffect(() => {
    if (!idParams) {
      const value = colorSizeWatch.reduce((
        prev: number,
        curr
      ) => prev + curr.quantity, 0);
      method.setValue('totalInit', value);
    }
  }, [colorSizeWatch, idParams, method]);
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
                                    || !productData?.translations[currentLang]?.slug) {
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
                            {t('product.code')}
                            {' '}
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
                            {t('product.categories')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="categories"
                            render={({
                              field: { value, onChange },
                            }) => (
                              <DropdownElement
                                type="productCategories"
                                placeholder={t('system.pleaseSelect')}
                                locale="vi"
                                value={value}
                                ids={value}
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
                      <Col span={24}>
                        <Row className="u-mt-16" gutter={16} style={{ alignItems: 'center' }}>
                          <Col span={12}>
                            <div className="p-editPageTemplate_input">
                              <Typography.Text strong>
                                {t('product.relatedProduct')}
                              </Typography.Text>
                              <Controller
                                name="relatedIds"
                                render={({
                                  field: { value, onChange },
                                }) => (
                                  <DropdownElement
                                    type="products"
                                    placeholder={t('system.pleaseSelect')}
                                    locale="vi"
                                    filterParams={String(value)}
                                    value={value}
                                    ids={value}
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
                          <Col span={6}>
                            <Controller
                              name="featured"
                              render={({
                                field: { onChange, value, ref },
                              }) => (
                                <div className="u-mt-8">
                                  <Checkbox
                                    ref={ref}
                                    checked={value}
                                    onChange={onChange}
                                  >
                                    {t('product.featuredProduct')}
                                  </Checkbox>
                                </div>
                              )}
                            />
                          </Col>
                          <Col span={6}>
                            <Controller
                              name="isBestSeller"
                              render={({
                                field: { onChange, value, ref },
                              }) => (
                                <div className="u-mt-8">
                                  <Checkbox
                                    ref={ref}
                                    checked={value}
                                    onChange={onChange}
                                  >
                                    {t('product.isBestSeller')}
                                  </Checkbox>
                                </div>
                              )}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <ColorSizeNestedArray control={method.control} />
                      </Col>
                    </Row>
                  </Card>
                  <Card type="inner">
                    <Row gutter={16}>
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('product.totalInit')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="totalInit"
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
                      <Col span={12}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('product.priceInit')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="priceInit"
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                type="text"
                                value={renderValue(String(value))}
                                onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
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
                            {t('product.price')}
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
                                type="text"
                                value={renderValue(String(value))}
                                onChange={(e) => e.currentTarget.value && onChange(Number(e.currentTarget.value.replaceAll(',', '')))}
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
                            {t('product.salePercent')}
                            {' '}
                          </Typography.Text>
                          <Controller
                            name="salePercent"
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
                  <Card type="inner">
                    <Row gutter={16}>
                      <Col span={24}>
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('product.short_description')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="shortDescription"
                            defaultValue=""
                            render={({
                              field: { value, onChange },
                            }) => (
                              <SimpleEditor
                                value={value || ''}
                                handleChange={(_event: any, editor: any) => {
                                  const data = editor.getData();
                                  onChange(data);
                                }}
                              />
                            )}
                          />
                        </div>
                      </Col>
                      <Col span={24}>
                        <div className="p-editPageTemplate_input u-mt-16">
                          <Typography.Text strong>
                            {t('product.description')}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            {' '}
                            *
                          </Typography.Text>
                          <Controller
                            name="description"
                            defaultValue=""
                            render={({
                              field: { value, onChange },
                              fieldState
                            }) => (
                              <>
                                <Editor
                                  value={value}
                                  handleChange={(_event: any, editor: any) => {
                                    const data = editor.getData();
                                    onChange(data);
                                  }}
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
                        </div>
                      </Col>
                    </Row>
                  </Card>
                  <Card>
                    <div className="p-editPageTemplate_input">
                      <Controller
                        name="thumbnail"
                        render={({
                          field: { value, onChange },
                          fieldState
                        }) => (
                          <>
                            <SelectFile
                              value={value}
                              name="thumbnail"
                              titleName="thumbnailTitle"
                              altName="thumbnailAlt"
                              hasOptions
                              handleSelect={(url) => {
                                onChange(url);
                              }}
                              handleDelete={() => onChange(undefined)}
                              title={(
                                <>
                                  <Typography.Text strong>
                                    {t('product.thumbnail')}
                                    {' '}
                                  </Typography.Text>
                                  <Typography.Text strong type="danger">
                                    *
                                  </Typography.Text>
                                </>
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
                    </div>
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Controller
                        name="galleries"
                        render={({
                          field: { value, onChange },
                        }) => (
                          <SelectMultipleFile
                            title={t('product.galeries')}
                            value={value}
                            handleSelect={(data) => {
                              onChange(data);
                            }}
                            handleDelete={(data) => onChange(data)}
                          />
                        )}
                      />
                    </div>
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
                  <StatusLabel status={status} bigger />
                </div>
                <div className="u-mt-16">
                  <Card>
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('product.status')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="status"
                        control={method.control}
                        render={({ field }) => (
                          <DropdownElement
                            options={statusDummy}
                            placeholder={`${t('system.select')} ${t('product.status')}`}
                            locale={currentLang}
                            filterParams={idParams.toString()}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="p-editPageTemplate_input u-mt-16">
                      <Typography.Text strong>
                        {t('product.displayOrder')}
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
                  </Card>
                </div>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={productData ? moment(productData.productData.createdAt).fromNow() : ''}
                  createdBy="Admin"
                  lastUpdated={productData ? moment(productData.productData.updatedAt).fromNow() : ''}
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

export default ProductDetail;
