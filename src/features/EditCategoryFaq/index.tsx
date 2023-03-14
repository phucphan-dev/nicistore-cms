import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Space, Spin, Typography
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, {
  useEffect, useMemo, useRef, useState
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  useInfiniteQuery, useMutation, useQuery, useQueryClient
} from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import { DropdownElement } from 'common/components/DropdownType';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import SeoPlugin from 'common/components/SeoPlugin';
import { CommentItem } from 'common/components/SeoPlugin/CommentList';
import SeoSection, { SeoSectionActionProps } from 'common/components/SeoSection';
import { SeoFormTypes } from 'common/components/SeoSection/types';
import StatusLabel, { StatusButtons } from 'common/components/StatusLabel';
import {
  createFaqCategoriesService, createFaqCategoryCommentService, getFaqCategoryByIdService,
  getFaqCategoryCommentService,
  updateFaqCategoriesService, updateStatusFaqCategoryService
} from 'common/services/faqs';
import { CreateFaqCategoriesParamsTypes, CreateFaqCategoryCommentParams } from 'common/services/faqs/types';
import { ROUTE_PATHS, socialList } from 'common/utils/constant';
import {
  generateSlug, returnDefaultOG, returnOgData
} from 'common/utils/functions';
import { updateCategoryFaqByIdSchema } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

export type NewsFormTypes = {
  displayOrder: number;
  name: string;
  slug: string;
  description: string;
  parentId?: number;
};

const defaultValues = {
  displayOrder: 1,
  name: '',
  slug: '',
  description: '',
};

const EditCategoryFaq: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate, roleOther }) => {
  /* Hooks */
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);

  /* States */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const seoSectionRef = useRef<SeoSectionActionProps>(null);
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(1);

  /* React-hook-form */
  const method = useForm<NewsFormTypes>({
    resolver: yupResolver(updateCategoryFaqByIdSchema),
    defaultValues
  });

  const { isDirty } = method.formState;

  /* Queries */
  const { data: newsByIdData, isLoading } = useQuery(
    ['getCategoryById', currentLang, idParams],
    () => {
      if (idParams) {
        return getFaqCategoryByIdService({
          id: idParams,
          locale: currentLang
        });
      }
      return undefined;
    }
  );

  const {
    data: commentsListRes,
    isFetching: commentsListLoading,
    hasNextPage: commentListHasNextPage,
    fetchNextPage: commentsListLoadMore
  } = useInfiniteQuery(
    ['faq-category-comments', { currentLang, idParams }],
    ({ pageParam = 1 }) => getFaqCategoryCommentService(
      {
        faqCategoryId: idParams,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.FAQ_CATEGORY_COMMENT_INDEX) && !!idParams,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: updateNewsByIdMutate, isLoading: updateLoading } = useMutation(
    'updateCategoryFaq',
    async (data: {
      id: number;
      params: CreateFaqCategoriesParamsTypes
    }) => updateFaqCategoriesService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getCategoryById', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createNewsByIdMutate, isLoading: createLoading } = useMutation(
    'createCategoryFaq',
    createFaqCategoriesService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.FAQ_CATEGORY_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  const { mutate: updateStatusMutate, isLoading: updateStatusLoading } = useMutation(
    'updateNewsStatus',
    async (data: {
      id: number, statusId: number
    }) => updateStatusFaqCategoryService(data.id, data.statusId),
    {
      onSuccess: (_, params) => {
        setStatus(params.statusId);
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['getCategoryById', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
      }
    }
  );

  const {
    mutate: createCommentMutate,
    isLoading: createCommentLoading,
  } = useMutation(
    ['faq-category-comments-create'],
    async (params: CreateFaqCategoryCommentParams) => createFaqCategoryCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['faq-category-comments', { currentLang, idParams }]);
        seoSectionRef.current?.clearOthersForm('comment');
      },
      onError: () => {
        message.error(t('message.createCommentError'));
      }
    }
  );

  /* Functions */
  const handleComment = (idCategory: number) => {
    const dataOthersForm = seoSectionRef.current?.handleOthersForm();

    if (dataOthersForm?.comment) {
      createCommentMutate({
        faqCategoryId: idCategory,
        comment: dataOthersForm.comment
      });
    }
  };

  const onSubmit = async (addingFn?: (id: number) => void) => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const dataSeoForm = await seoSectionRef.current?.handleForm();

    const newsParams = {
      displayOrder: formData.displayOrder,
      parentId: formData.parentId,
      translations: {
        [currentLang]: {
          faqCategoryData: {
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
          },
        }
      },
      seoData: {
        [currentLang]: {
          title: dataSeoForm?.seoTitle,
          description: dataSeoForm?.seoIntro,
          keywords: dataSeoForm?.seoKeyword,
          metaRobot: dataSeoForm?.metaRobot,
          structureData: dataSeoForm?.structuredData,
          metaViewport: dataSeoForm?.metaViewPort,
          canonicalUrl: dataSeoForm?.canonicalURL,
          image: dataSeoForm?.ogImage
        }
      },
      ogData: returnOgData(currentLang, dataSeoForm?.mediaSocial)
    };

    if (idParams) {
      updateNewsByIdMutate({
        id: idParams,
        params: newsParams
      });
    } else {
      createNewsByIdMutate(newsParams, {
        onSuccess: (data) => addingFn && addingFn(data.id),
      });
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

  const handleLoadMoreComments = () => {
    if (commentListHasNextPage) {
      commentsListLoadMore();
    }
  };

  const handleChangeStatusAndSave = async (stat: number) => {
    if (!idParams) {
      await onSubmit((id) => {
        handleComment(id);
        updateStatusMutate({ id, statusId: stat });
      });
    } else {
      if (isDirty || seoSectionRef.current?.isFormDirty()) {
        await onSubmit();
      }
      handleComment(idParams);
      updateStatusMutate({ id: idParams, statusId: stat });
    }
  };

  const submitForm = async () => {
    if (!idParams) {
      await onSubmit((id) => {
        handleComment(id);
      });
    } else {
      await onSubmit();
      handleComment(idParams);
    }
    queryClient.invalidateQueries(['getCategoryById', currentLang, idParams]);
  };

  /* Datas */
  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!newsByIdData) {
      return undefined;
    }
    const seoData = newsByIdData.seoData && newsByIdData.seoData[`${currentLang}`];
    const { ogData } = newsByIdData;
    return {
      seoTitle: seoData?.title || '',
      seoIntro: seoData?.description || '',
      seoKeyword: seoData?.keywords || '',
      ogImage: seoData?.image,
      metaRobot: seoData?.metaRobot,
      metaViewPort: seoData?.metaViewport,
      canonicalURL: seoData?.canonicalUrl,
      structuredData: seoData?.structureData,
      mediaSocial: returnDefaultOG(ogData, currentLang),
    } as SeoFormTypes;
  }, [currentLang, newsByIdData]);

  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.faqCategoryCommentData.id,
          content: item.faqCategoryCommentData.comment,
          commentName: item.updater.name,
          time: item.faqCategoryCommentData.updatedAt,
        })) || [];
        list = [...list, ...commentDataList];
      });
      return list;
    }
    return [];
  }, [commentsListRes]);

  /* Effects */
  useEffect(() => {
    if (newsByIdData && newsByIdData.translations[currentLang]) {
      setStatus(newsByIdData.faqCategoryData.status);
      const {
        name, slug, description,
      } = newsByIdData.translations[currentLang];
      const objDefault = {
        name,
        slug,
        description,
        displayOrder: newsByIdData.faqCategoryData.displayOrder,
        parentId: newsByIdData.faqCategoryData.parentId,
        status: newsByIdData.faqCategoryData.status,
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [newsByIdData, currentLang, method]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={idParams ? t('faqCategoryDetail.editCategory') : t('faqCategoryDetail.createCategory')}
        rightHeader={(
          <Space size={16}>
            {status && (
              <StatusButtons
                loading={updateStatusLoading}
                status={status}
                isApprove={roleOther.includes(roles.FAQ_CATEGORY_APPROVED)}
                handleChangeStatus={(stat) => {
                  handleChangeStatusAndSave(stat);
                }}
              />
            )}
            {status !== 13 && (
              <Button
                type="primary"
                disabled={(idParams && !roleUpdate) || (!idParams && !roleCreate)}
                loading={updateLoading || createLoading || createCommentLoading}
                onClick={method.handleSubmit(submitForm)}
              >
                <SaveOutlined />
                {t('system.save')}
              </Button>
            )}
          </Space>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Spin size="large" spinning={updateLoading || isLoading || createLoading || commentsListLoading}>
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
                                  if (!idParams || !newsByIdData?.translations[currentLang]?.slug) {
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
                    <div className="site-card-border-less-wrapper">
                      <Space direction="vertical" size={24} style={{ width: '100%' }}>
                        {/* Mô tả  */}
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('system.description')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="description"
                            control={method.control}
                            render={({ field, fieldState }) => (
                              <>
                                <TextArea
                                  {...field}
                                  className="u-mt-8"
                                  value={field.value}
                                  onChange={field.onChange}
                                  size="large"
                                  rows={6}
                                  style={{ minHeight: 50 }}
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
                      </Space>
                    </div>
                  </Card>
                </Space>

                <SeoSection
                  canCreateComment={getPermission(rolesUser, roles.FAQ_CATEGORY_COMMENT_STORE)}
                  defaultValues={defaultValueSEO}
                  ref={seoSectionRef}
                  socialList={socialList}
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
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('newsDetail.displayOrder')}
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
                  </Space>
                </Card>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={newsByIdData ? moment(newsByIdData.faqCategoryData.createdAt).fromNow() : ''}
                  createdBy={newsByIdData?.creator.name || ''}
                  lastUpdated={newsByIdData ? moment(newsByIdData.faqCategoryData.updatedAt).fromNow() : ''}
                  lastUpdatedBy={newsByIdData?.updater.name || ''}
                  languageList={languageOptions}
                  currentLang={currentLang}
                  handleChangeLang={
                    (value) => value && handleChangeLang(value as LanguageCodeTypes)
                  }
                />
                <SeoPlugin
                  commentList={commentsList}
                  handleSeeMoreComment={handleLoadMoreComments}
                  handleOpenPreview={() => seoSectionRef.current?.handleOpenBrowserPreview()}
                  handleOpenSocialPreview={() => seoSectionRef.current?.handleOpenSocialPreview()}
                />
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

export default EditCategoryFaq;
