import { SaveOutlined, SelectOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, DatePicker, message, Row, Space, Spin, Typography
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
import DropdownMultiple from 'common/components/DropdownMultiple';
import { DropdownElement } from 'common/components/DropdownType';
import Editor from 'common/components/Editor';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import SelectFile from 'common/components/SelectFile';
import SeoPlugin from 'common/components/SeoPlugin';
import { CommentItem } from 'common/components/SeoPlugin/CommentList';
import SeoSection, { SeoSectionActionProps } from 'common/components/SeoSection';
import { SeoFormTypes } from 'common/components/SeoSection/types';
import StatusLabel, { StatusButtons } from 'common/components/StatusLabel';
import { setSessionStorage } from 'common/services/common/storage';
import {
  createNewsCommentService,
  createNewsService,
  getNewsByIdService,
  getNewsCommentService,
  updateNewsByIdService,
  updateNewsStatusService,
} from 'common/services/news';
import { CreateNewsCommentParams, CreateUpdateNewsParamsTypes } from 'common/services/news/types';
import LOCAL_STORAGE, { ROUTE_PATHS, socialList } from 'common/utils/constant';
import {
  delay, generateSlug, returnDefaultOG, returnOgData
} from 'common/utils/functions';
import { updateNewsByIdSchema } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

export type NewsFormTypes = {
  displayOrder: number;
  publishedAt?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  thumbnailTitle?: string;
  thumbnailAlt?: string;
  status: number;
  relatedIds?: number[];
  categoryIds?: number[];
  tags?: string[];
};

const NewsEdit: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate, roleOther }) => {
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
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(1);

  /* Variables */
  const defaultValues = {
    displayOrder: 1,
    publishedAt: moment().toISOString(),
    title: '',
    slug: '',
    description: '',
    content: '',
    thumbnail: '',
  };

  const method = useForm<NewsFormTypes>({
    resolver: yupResolver(updateNewsByIdSchema),
    defaultValues
  });

  const { isDirty } = method.formState;

  /* Queries */
  const { data: newsByIdData, isLoading } = useQuery(
    ['getNewsById', currentLang, idParams],
    () => {
      if (idParams) {
        return getNewsByIdService({
          id: idParams,
          locale: currentLang
        });
      }
      return undefined;
    }
  );

  const { mutate: updateNewsByIdMutate, isLoading: updateLoading } = useMutation(
    'updateNewsById',
    async (data: {
      id: number;
      params: CreateUpdateNewsParamsTypes
    }) => updateNewsByIdService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createNewsByIdMutate, isLoading: createLoading } = useMutation(
    'createNews',
    createNewsService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.NEWS_MANAGEMENT}`);
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
    }) => updateNewsStatusService(data.id, data.statusId),
    {
      onSuccess: (_, params) => {
        setStatus(params.statusId);
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['getNewsById', currentLang, idParams]);
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
    ['news-comments', { currentLang, idParams }],
    ({ pageParam = 1 }) => getNewsCommentService(
      {
        newsId: idParams,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.NEWS_COMMENT_INDEX) && !!idParams,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: createCommentMutate, isLoading: createCommentLoading } = useMutation(
    ['news-comments-create'],
    async (params: CreateNewsCommentParams) => createNewsCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['news-comments', { currentLang, idParams }]);
        seoSectionRef.current?.clearOthersForm('comment');
      },
      onError: () => {
        message.error(t('message.createCommentError'));
      }
    }
  );

  /* Functions */
  const handleComment = (id?: number) => {
    const dataOthersForm = seoSectionRef.current?.handleOthersForm();

    if (dataOthersForm?.comment) {
      createCommentMutate({ newsId: id || idParams, comment: dataOthersForm.comment });
    }
  };

  const onSubmit = async (addingFn?: (id: number) => void) => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const published = moment(formData.publishedAt).toISOString();
    const dataSeoForm = await seoSectionRef.current?.handleForm();

    const newsParams = {
      publishedAt: published,
      displayOrder: formData.displayOrder,
      relatedIds: formData.relatedIds,
      categoryIds: formData.categoryIds,
      status: formData.status,
      translations: {
        [currentLang]: {
          newsData: {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            description: formData.description,
            thumbnail: {
              path: formData.thumbnail,
              title: formData.thumbnailTitle,
              alt: formData.thumbnailAlt
            },
          },
          tags: formData.tags,
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

  const handlePreview = async () => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const published = moment(formData.publishedAt).toISOString();
    const dataSeoForm = await seoSectionRef.current?.handleForm();
    const newsParams = {
      publishedAt: published,
      displayOrder: formData.displayOrder,
      relatedIds: formData.relatedIds,
      categoryIds: formData.categoryIds,
      status: formData.status,
      translations: {
        [currentLang]: {
          newsData: {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            description: formData.description,
            thumbnail: {
              path: formData.thumbnail,
              title: formData.thumbnailTitle,
              alt: formData.thumbnailAlt
            },
          },
          tags: formData.tags,
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
    const savingData = { type: 'news', data: newsParams };
    setSessionStorage(LOCAL_STORAGE.PREVIEW_DATA, JSON.stringify(savingData));
    window.open('/preview', '_blank');
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
        updateStatusMutate({ id, statusId: stat });
        handleComment(id);
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
    queryClient.invalidateQueries(['getNewsById', currentLang, idParams]);
  };

  /* Datas */
  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.newsCommentData.id,
          content: item.newsCommentData.comment,
          commentName: item.updater.name,
          time: item.newsCommentData.updatedAt,
        })) || [];
        list = [...list, ...commentDataList];
      });
      return list;
    }
    return [];
  }, [commentsListRes]);

  /* Effects */
  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!newsByIdData) {
      return undefined;
    }
    const seo = newsByIdData.seoData && newsByIdData.seoData[`${currentLang}`];
    const og = newsByIdData.ogData;
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
  }, [currentLang, newsByIdData]);

  useEffect(() => {
    if (newsByIdData && newsByIdData.translations[currentLang]) {
      setStatus(newsByIdData.newsData.status);
      const {
        title, slug, thumbnail, content, description,
      } = newsByIdData.translations[currentLang];
      const objDefault = {
        title,
        slug,
        thumbnail: thumbnail.path,
        thumbnailTitle: thumbnail.title,
        thumbnailAlt: thumbnail.alt,
        status: newsByIdData.newsData.status,
        content,
        displayOrder: newsByIdData.newsData.displayOrder,
        description,
        publishedAt: moment(newsByIdData.newsData.publishedAt).toISOString(),
        categoryIds: newsByIdData.categories?.map((item) => item.id),
        relatedIds: newsByIdData.relatedNews?.map((item) => item.id),
        tags: newsByIdData.translations[currentLang].tags,
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsByIdData, currentLang]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={idParams ? t('newsDetail.editNews') : t('newsDetail.createNews')}
        rightHeader={(
          <Space size={16}>
            <Button
              disabled={(idParams && !roleUpdate) || (!idParams && !roleCreate)}
              onClick={handlePreview}
            >
              <SelectOutlined />
              {t('system.preview')}
            </Button>
            <StatusButtons
              loading={updateStatusLoading}
              status={status}
              isApprove={roleOther.includes(roles.NEWS_APPROVED)}
              handleChangeStatus={(stat) => {
                handleChangeStatusAndSave(stat);
              }}
            />
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
        <Spin size="large" spinning={updateLoading || isLoading || createLoading || loadingTemplate || commentsListLoading}>
          <FormProvider {...method}>
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
                            name="title"
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
                        {/* Nội dung  */}
                        <div className="p-editPageTemplate_input">
                          <div style={{ marginBottom: 8 }}>
                            <Typography.Text strong>
                              {t('system.content')}
                              {' '}
                            </Typography.Text>
                            <Typography.Text strong type="danger">
                              *
                            </Typography.Text>
                          </div>
                          <Controller
                            name="content"
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
                      </Space>
                    </div>
                  </Card>
                </Space>
                <SeoSection
                  canCreateComment={getPermission(rolesUser, roles.NEWS_COMMENT_STORE)}
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
                    {/* Tin tức liên quan  */}
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('newsDetail.relatedNews')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="relatedIds"
                        render={(controller) => (
                          <DropdownMultiple
                            controller={controller}
                            type="news"
                            placeholder={`${t('system.select')} ${t('newsDetail.relatedNews')}`}
                            filterParams={idParams.toString()}
                            locale={currentLang}
                            isHideValueInSelect
                          />
                        )}
                      />
                    </div>
                    {/* Danh mục liên quan */}
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('newsDetail.relatedCategory')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="categoryIds"
                        control={method.control}
                        render={({ field }) => (
                          <DropdownElement
                            type="newsCategory"
                            placeholder={`${t('system.select')} ${t('newsDetail.relatedCategory')}`}
                            locale={currentLang}
                            value={field.value}
                            onChange={field.onChange}
                            multiple={{}}
                          />
                        )}
                      />
                    </div>
                    {/* Tag */}
                    <div className="p-editPageTemplate_input">
                      <Typography.Text strong>
                        {t('newsDetail.tags')}
                        {' '}
                      </Typography.Text>
                      <Controller
                        name="tags"
                        control={method.control}
                        render={({ field }) => (
                          <DropdownElement
                            type="tag"
                            placeholder={`${t('system.select')} ${t('newsDetail.tags')}`}
                            locale={currentLang}
                            value={field.value}
                            onChange={field.onChange}
                            isValueSlug
                            multiple={{}}
                          />
                        )}
                      />
                    </div>
                    {/* Thời gian đăng  */}
                    <div>
                      <Typography.Text strong>
                        {t('newsDetail.publishedTime')}
                      </Typography.Text>
                      <Controller
                        name="publishedAt"
                        control={method.control}
                        render={({ field }) => (
                          <DatePicker
                            size="large"
                            value={moment(field.value)}
                            onChange={field.onChange}
                            format="DD/MM/YYYY HH:mm"
                            defaultValue={moment()}
                            showTime
                            style={{ width: '100%' }}
                          />
                        )}
                      />
                    </div>
                    <div>
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
                    {/* THUMBNAIL  */}
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
                              handleSelect={(url, title, alt) => {
                                onChange(url);
                                method.setValue('thumbnailTitle', title);
                                method.setValue('thumbnailAlt', alt);
                              }}
                              handleDelete={() => onChange(undefined)}
                              title={(
                                <>
                                  <Typography.Text strong>
                                    {t('newsDetail.thumbnail')}
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
                  </Space>
                </Card>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={newsByIdData ? moment(newsByIdData.newsData.createdAt).fromNow() : ''}
                  createdBy={newsByIdData?.creator.name || ''}
                  lastUpdated={newsByIdData ? moment(newsByIdData.newsData.updatedAt).fromNow() : ''}
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
          {t('message.confirmSkipInfo')}
        </ModalConfirm>
      </div>
    </>
  );
};

export default NewsEdit;
