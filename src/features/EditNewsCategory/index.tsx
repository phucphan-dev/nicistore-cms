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
  createNewsCategoryByIdService,
  createNewsCategoryCommentService,
  getNewsCategoryByIdService,
  getNewsCategoryCommentService,
  updateNewsCategoryByIdService,
  updateNewsCategoryStatusService
} from 'common/services/news';
import { CreateNewsCategoryCommentParams, CreateUpdateNewsCategoryByIdParamsTypes } from 'common/services/news/types';
import { ROUTE_PATHS, socialList } from 'common/utils/constant';
import {
  delay, generateSlug, returnDefaultOG, returnOgData
} from 'common/utils/functions';
import { updateNewsCategoriesByIdSchema } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

export type EditNewsFormTypes = {
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  status: number;
};

const EditNewsCategory: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate, roleOther }) => {
  /* Hooks */
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);

  /* States */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const seoSectionRef = useRef<SeoSectionActionProps>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [status, setStatus] = useState<number>(1);

  /* Variables */
  const defaultValues = {
    name: '',
    slug: '',
    description: '',
    displayOrder: 1,
  };

  const method = useForm<EditNewsFormTypes>({
    resolver: yupResolver(updateNewsCategoriesByIdSchema),
    defaultValues
  });
  const { isDirty } = method.formState;

  /* Queries */
  const { data: categoryByIdData, isLoading } = useQuery(
    ['getNewsCategoryById', idParams, currentLang],
    () => {
      if (idParams) {
        return getNewsCategoryByIdService({
          id: idParams,
          locale: currentLang
        });
      }
      return undefined;
    },
    {
      enabled: !!(currentLang && idParams),
      refetchOnMount: 'always',
    }
  );

  const { mutate: updateNewsCateByIdMutate, isLoading: updateLoading } = useMutation(
    'updateNewsById',
    async (data: {
      id: number;
      params: CreateUpdateNewsCategoryByIdParamsTypes
    }) => updateNewsCategoryByIdService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getNewsCategoryById', idParams, currentLang]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createNewsCateByIdMutate, isLoading: createLoading } = useMutation(
    'createNews',
    createNewsCategoryByIdService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.NEWS_CATEGORY_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  const { mutate: updateStatusMutate, isLoading: updateStatusLoading } = useMutation(
    ['updateNewsStatus', idParams],
    async (data: {
      id: number, statusId: number
    }) => updateNewsCategoryStatusService(data.id, data.statusId),
    {
      onSuccess: (_, params) => {
        setStatus(params.statusId);
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['getNewsCategoryById', idParams, currentLang]);
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
      }
    }
  );

  const {
    data: commentsListRes,
    isFetching: commentsListLoading,
    hasNextPage: commentListHasNextPage,
    fetchNextPage: commentsListLoadMore
  } = useInfiniteQuery(
    ['news-category-comments', { currentLang, idParams }],
    ({ pageParam = 1 }) => getNewsCategoryCommentService(
      {
        newsCategoryId: idParams,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.NEWS_CATE_COMMENT_INDEX) && !!idParams,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: createCommentMutate, isLoading: createCommentLoading } = useMutation(
    ['news-category-comments-create'],
    async (params: CreateNewsCategoryCommentParams) => createNewsCategoryCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['news-category-comments', { currentLang, idParams }]);
        seoSectionRef.current?.clearOthersForm('comment');
      },
      onError: () => {
        message.error(t('message.createCommentError'));
      }
    }
  );

  /* Functions */
  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!categoryByIdData) {
      return undefined;
    }
    const seo = categoryByIdData.seoData && categoryByIdData.seoData?.[`${currentLang}`];
    const og = categoryByIdData.ogData;
    return {
      seoTitle: seo?.title || '',
      seoIntro: seo?.description || '',
      seoKeyword: seo?.keywords || '',
      ogImage: seo?.image,
      metaRobot: seo?.metaRobot,
      metaViewPort: seo?.metaViewport,
      canonicalURL: seo?.canonicalUrl,
      structuredData: seo?.structureData,
      mediaSocial: returnDefaultOG(og, currentLang),
    } as SeoFormTypes;
  }, [currentLang, categoryByIdData]);

  const handleComment = (id?: number) => {
    const dataOthersForm = seoSectionRef.current?.handleOthersForm();

    if (dataOthersForm?.comment) {
      createCommentMutate({ newsCategoryId: id || idParams, comment: dataOthersForm.comment });
    }
  };

  const onSubmit = async (addingFn?: (id: number) => void) => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const dataSeoForm = await seoSectionRef.current?.handleForm();

    const newsParams: CreateUpdateNewsCategoryByIdParamsTypes = {
      displayOrder: formData.displayOrder,
      status: formData.status,
      translations: {
        [currentLang]: {
          newsCategoryData: {
            name: formData.name,
            slug: formData.slug,
            description: formData.description
          }
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
      updateNewsCateByIdMutate({
        id: idParams,
        params: newsParams
      });
    } else {
      createNewsCateByIdMutate(newsParams, {
        onSuccess: (data) => addingFn && addingFn(data.id),
      });
    }
  };

  const changeLanguageAction = async (lang?: string) => {
    if (lang) {
      setConfirm(undefined);
      setLoadingTemplate(true);
      await delay(1000);
      setCurrentLang(lang as LanguageCodeTypes);
      setSearchParams({
        id: String(idParams),
        locale: lang,
      });
      setLoadingTemplate(false);
    }
  };

  const handleChangeLang = (lang: string) => {
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
      handleComment();
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
      handleComment();
    }
    queryClient.invalidateQueries(['getNewsCategoryById', idParams, currentLang]);
  };

  /* Datas */
  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.newsCategoryCommentData.id,
          content: item.newsCategoryCommentData.comment,
          commentName: item.updater.name,
          time: item.newsCategoryCommentData.updatedAt,
        })) || [];
        list = [...list, ...commentDataList];
      });
      return list;
    }
    return [];
  }, [commentsListRes]);

  /* Effects */
  useEffect(() => {
    if (categoryByIdData && categoryByIdData.translations?.[currentLang]) {
      setStatus(categoryByIdData.newsCategoryData.status);
      if (categoryByIdData.translations && categoryByIdData.translations[currentLang]) {
        const { name, slug, description } = categoryByIdData.translations[currentLang];
        const objDefault = {
          name,
          slug,
          description,
          displayOrder: categoryByIdData.newsCategoryData.displayOrder,
          status: categoryByIdData.newsCategoryData.status,
        };
        method.reset(objDefault);
      }
    } else method.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryByIdData, currentLang]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={t('newsDetail.editNewsCategory')}
        rightHeader={(
          <Space size={16}>
            {status && (
              <StatusButtons
                loading={updateStatusLoading}
                status={status}
                isApprove={roleOther.includes(roles.NEWS_CATE_APPROVED)}
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
        <FormProvider {...method}>
          <Spin size="large" spinning={isLoading || updateLoading || createLoading || loadingTemplate || commentsListLoading}>
            <Row gutter={16}>
              <Col xxl={18} xl={16} lg={16}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
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
                            defaultValue=""
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
                                    || !categoryByIdData?.translations?.[currentLang]?.slug) {
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
                            defaultValue=""
                            control={method.control}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                name="slug"
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
                  <Card
                    type="inner"
                  >
                    <div className="site-card-border-less-wrapper">
                      <Space direction="vertical" size={12} style={{ width: '100%' }}>
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
                            defaultValue=""
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
                  canCreateComment={getPermission(rolesUser, roles.NEWS_CATE_COMMENT_STORE)}
                  defaultValues={defaultValueSEO}
                  ref={seoSectionRef}
                  socialList={socialList}
                />
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <div className="u-mb-16">
                  {status && <StatusLabel status={status} bigger />}
                </div>
                <div className="u-mb-16">
                  <Card>
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
                  </Card>
                </div>
                <ManagementInfo
                  createdDate={categoryByIdData ? moment(categoryByIdData.newsCategoryData.createdAt).fromNow() : ''}
                  createdBy={categoryByIdData?.creator.name || ''}
                  lastUpdated={categoryByIdData ? moment(categoryByIdData.newsCategoryData.updatedAt).fromNow() : ''}
                  lastUpdatedBy={categoryByIdData?.updater.name || ''}
                  languageList={languageOptions}
                  currentLang={currentLang}
                  handleChangeLang={(
                    value
                  ) => value && handleChangeLang(value as LanguageCodeTypes)}
                />
                <SeoPlugin
                  commentList={commentsList}
                  handleSeeMoreComment={handleLoadMoreComments}
                  handleOpenPreview={() => seoSectionRef.current?.handleOpenBrowserPreview()}
                  handleOpenSocialPreview={() => seoSectionRef.current?.handleOpenSocialPreview()}
                />
              </Col>
            </Row>
          </Spin>
        </FormProvider>
        <ModalConfirm
          isShow={!!confirm}
          handleCancel={() => setConfirm(undefined)}
          handleConfirm={() => changeLanguageAction(confirm)}
          handleClose={() => setConfirm(undefined)}
        >
          {t('message.confirmSkipInfo')}
        </ModalConfirm>
      </div>
    </>
  );
};

export default EditNewsCategory;
