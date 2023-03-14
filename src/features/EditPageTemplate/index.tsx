import { SaveOutlined, SelectOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, message, Row, Space, Spin, Typography
} from 'antd';
import moment from 'moment';
import React, {
  useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  useInfiniteQuery, useMutation, useQuery, useQueryClient
} from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { PageHeaderSectionActionRef } from './PageHeaderSection';
import RenderTemplate, { RenderTemplateRef } from './RenderUI/RenderTemplate';
import Sidebar from './Sidebar';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ModalConfirm from 'common/components/ModalConfirm';
import { CommentItem } from 'common/components/SeoPlugin/CommentList';
import SeoSection, { SeoSectionActionProps } from 'common/components/SeoSection';
import { SeoFormTypes } from 'common/components/SeoSection/types';
import { StatusButtons } from 'common/components/StatusLabel';
import { setSessionStorage } from 'common/services/common/storage';
import getDropdownTypeService from 'common/services/dropdownType';
import { DropdownTypeItem } from 'common/services/dropdownType/types';
import {
  changeStatusPagesService,
  createPageCommentService,
  createPagesService, getAllTemplatePagesService, getDetailPagesService,
  getPageCommentService,
  updatePagesService
} from 'common/services/pages';
import { CreatePageCommentParams, CreatePageParams } from 'common/services/pages/types';
import LOCAL_STORAGE, { ROUTE_PATHS, socialList } from 'common/utils/constant';
import {
  delay, generateSlug, returnDefaultOG, returnOgData
} from 'common/utils/functions';
import { pageDetailMainData } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

type MainDataTypes = {
  title: string;
  slug: string;
};

const EditPageTemplate: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate, roleOther }) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigator = useNavigate();
  const queryClient = useQueryClient();

  const [searchParams, setSearchParams] = useSearchParams();
  const mainMethod = useForm<MainDataTypes>({
    resolver: yupResolver(pageDetailMainData),
    mode: 'onChange',
    defaultValues: {
      title: '',
      slug: ''
    }
  });

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);

  /* Variables */
  const idParam = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const { isDirty } = mainMethod.formState;

  /* States */
  const [currentLang, setCurrentLang] = useState<string>(localeParams);
  const [templateSelected, setTemplateSelected] = useState<string | undefined>(undefined);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(1);

  /* Refs */
  const pageHeaderSectionRef = useRef<PageHeaderSectionActionRef>(null);
  const seoSectionRef = useRef<SeoSectionActionProps>(null);
  const templateRef = useRef<RenderTemplateRef>(null);

  /* Queries */
  const { data: allPageTemplate, isLoading: loadingAllTemplates } = useQuery(
    ['getAllPageTemplate'],
    () => getAllTemplatePagesService(),
  );
  const { data: dropdownPage, isLoading: loadingDropdownPage } = useQuery(
    ['getDropdownPage'],
    () => getDropdownTypeService<DropdownTypeItem>('page'),
  );
  const { data: detailPage, isLoading: loadingPage } = useQuery(
    ['getDetailPage', currentLang, idParam],
    () => {
      if (idParam) {
        return getDetailPagesService(idParam, currentLang);
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
    ['page-comments', { currentLang, idParam }],
    ({ pageParam = 1 }) => getPageCommentService(
      {
        pageId: idParam,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.PAGE_COMMENT_INDEX) && !!idParam,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: updateStatusMutate, isLoading: updateStatusLoading } = useMutation(
    'updateNewsStatus',
    async (data: {
      id: number, statusId: number
    }) => changeStatusPagesService(data.id, data.statusId),
    {
      onSuccess: (_, params) => {
        setStatus(params.statusId);
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['getDetailPage', currentLang, idParam]);
      },
      onError: () => {
        message.error(t('message.updateStatusError'));
      }
    }
  );

  const { mutate: createCommentMutate, isLoading: createCommentLoading } = useMutation(
    ['page-comments-create'],
    async (params: CreatePageCommentParams) => createPageCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['page-comments', { currentLang, idParam }]);
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
      createCommentMutate({ pageId: id || idParam, comment: dataOthersForm.comment });
    }
  };

  const handleSubmit = async (language: string, addingFn?: (id: number) => void) => {
    const result = await mainMethod.trigger(['title', 'slug']);
    const dataPageHeader = await pageHeaderSectionRef.current?.handleForm();

    if (result && dataPageHeader?.sample) {
      const mainData = mainMethod.getValues();
      const dataTemplateForm = templateRef.current?.handleSubmit();
      const dataSeoForm = await seoSectionRef.current?.handleForm();

      const dataSubmit: CreatePageParams = {
        templateCode: templateSelected,
        parentId: dataPageHeader?.parent && dataPageHeader?.parent > -1
          ? dataPageHeader?.parent : null,
        isHome: dataPageHeader?.isHome,
        translations: {
          [language]: {
            pageData: {
              title: mainData.title,
              slug: mainData.slug
            },
            blocks: dataTemplateForm
          }
        },
        seoData: {
          [language]: {
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
        ogData: returnOgData(language, dataSeoForm?.mediaSocial)
      };

      try {
        if (idParam) {
          await updatePagesService(idParam, dataSubmit);
          message.success(t('message.updateSuccess'));
        } else {
          const data = await createPagesService(dataSubmit);
          if (addingFn) {
            addingFn(data.id);
          }
          message.success(t('message.createSuccess'));
          navigator(ROUTE_PATHS.PAGE_MANAGEMENT);
        }
      } catch (error: any) {
        message.error(idParam ? t('message.updateError') : t('message.createError'));
      }
    }
  };

  const handlePreview = async (language: string) => {
    const dataPageHeader = await pageHeaderSectionRef.current?.handleForm();
    const isVal = await mainMethod.trigger();
    if (!isVal || !dataPageHeader?.sample) {
      return;
    }
    const dataTemplateForm = templateRef.current?.handleSubmit();
    const mainData = mainMethod.getValues();
    const dataSeoForm = await seoSectionRef.current?.handleForm();

    const dataSubmit: CreatePageParams = {
      templateCode: templateSelected,
      parentId: dataPageHeader?.parent && dataPageHeader?.parent > -1
        ? dataPageHeader?.parent : null,
      isHome: dataPageHeader?.isHome,
      translations: {
        [language]: {
          pageData: {
            title: mainData.title,
            slug: mainData.slug
          },
          blocks: dataTemplateForm
        }
      },
      seoData: {
        [language]: {
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
      ogData: returnOgData(language, dataSeoForm?.mediaSocial)
    };
    const savingData = { type: 'page', data: dataSubmit };
    setSessionStorage(LOCAL_STORAGE.PREVIEW_DATA, JSON.stringify(savingData));
    window.open('/preview', '_blank');
  };

  const handleChangeTemplate = useCallback((code: string) => {
    setTemplateSelected(code);
  }, []);

  const changeLanguageAction = async (language?: string) => {
    if (language) {
      setConfirm(undefined);
      setLoadingTemplate(true);
      await delay(1000);
      setLoadingTemplate(false);
      setCurrentLang(language);
      setSearchParams({
        id: String(idParam),
        locale: language,
      });
    }
  };

  const handleChangeLanguage = (language: string) => {
    if (isDirty
      || templateRef.current?.isFormDirty()
      || seoSectionRef.current?.isFormDirty()
      || pageHeaderSectionRef.current?.isFormDirty()) {
      setConfirm(language);
    } else {
      changeLanguageAction(language);
    }
  };

  const handleLoadMoreComments = () => {
    if (commentListHasNextPage) {
      commentsListLoadMore();
    }
  };

  const handleChangeStatusAndSave = async (stat: number, language: string) => {
    if (!idParam) {
      await handleSubmit(language, (id) => {
        updateStatusMutate({ id, statusId: stat });
        handleComment(id);
      });
    } else {
      if (isDirty
        || templateRef.current?.isFormDirty()
        || seoSectionRef.current?.isFormDirty()
        || pageHeaderSectionRef.current?.isFormDirty()) {
        await handleSubmit(language);
      }
      handleComment();
      updateStatusMutate({ id: idParam, statusId: stat });
    }
  };

  const submitForm = async (language: string) => {
    if (!idParam) {
      await handleSubmit(language, (id) => {
        handleComment(id);
      });
    } else {
      await handleSubmit(language);
      handleComment();
    }
    queryClient.invalidateQueries(['getDetailPage', currentLang, idParam]);
  };

  /* Datas */
  const templatePage = useMemo(() => allPageTemplate?.find(
    (templ) => templ.code === templateSelected
  ), [allPageTemplate, templateSelected]);

  const listTemplate = useMemo(() => {
    const converter = allPageTemplate?.map(
      (item) => ({ value: item.code, label: item.name })
    ) || [];
    return [{ value: -1, label: '---' }, ...converter];
  }, [allPageTemplate]);

  const listParent = useMemo(() => {
    const converter = dropdownPage?.data.filter((it: any) => it.id !== idParam).map(
      (item) => ({ value: item.id, label: item.text })
    ) || [];
    return [{ value: -1, label: '---' }, ...converter];
  }, [dropdownPage, idParam]);

  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!detailPage) {
      return undefined;
    }
    const seo = detailPage?.seoData && detailPage?.seoData[`${currentLang}`];
    const og = detailPage?.ogData;
    return {
      seoTitle: seo?.title || '',
      seoIntro: seo?.description || '',
      seoKeyword: seo?.keywords || '',
      ogImage: seo?.image || '',
      metaRobot: seo?.metaRobot,
      metaViewPort: seo?.metaViewport,
      canonicalURL: seo?.canonicalUrl,
      structuredData: seo?.structureData,
      mediaSocial: returnDefaultOG(og, currentLang),
    } as SeoFormTypes;
  }, [currentLang, detailPage]);

  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.pageCommentData.id,
          content: item.pageCommentData.comment,
          commentName: item.updater.name,
          time: item.pageCommentData.updatedAt,
        })) || [];
        list = [...list, ...commentDataList];
      });
      return list;
    }
    return [];
  }, [commentsListRes]);

  /* Effects */
  useEffect(() => {
    if (detailPage) {
      setStatus(detailPage.pageData.status);
      setTemplateSelected(detailPage.template.code);
      mainMethod.reset({ title: (detailPage.translations || {})[`${currentLang}`]?.title, slug: (detailPage.translations || {})[`${currentLang}`]?.slug });
      pageHeaderSectionRef.current?.handleSetDefault({
        sample: detailPage.template.code,
        parent: detailPage.pageData.parentId,
        isHome: detailPage.pageData.isHome
      });
    } else {
      mainMethod.reset();
      pageHeaderSectionRef.current?.handleResetForm();
      setTemplateSelected(undefined);
    }
  }, [detailPage, mainMethod, currentLang]);

  useEffect(() => {
    if (localeParams) {
      setCurrentLang(localeParams);
    }
  }, [localeParams]);

  /* Render */
  return (
    <>
      {(loadingPage || loadingAllTemplates
        || loadingDropdownPage || loadingTemplate
        || createCommentLoading || commentsListLoading) && <Spin className="center-absolute" size="large" spinning />}
      <HeaderPage
        fixed
        title={detailPage ? t('page.editPage') : t('page.createPage')}
        rightHeader={(
          <Space size={16}>
            <Button
              disabled={(idParam && !roleUpdate) || (!idParam && !roleCreate)}
              onClick={() => handlePreview(currentLang)}
            >
              <SelectOutlined />
              {t('system.preview')}
            </Button>
            <StatusButtons
              loading={updateStatusLoading}
              status={status}
              isApprove={roleOther.includes(roles.PAGE_APPROVED)}
              handleChangeStatus={(stat) => handleChangeStatusAndSave(stat, currentLang)}
            />
            {status !== 13 && (
              <Button
                type="primary"
                disabled={(idParam && !roleUpdate) || (!idParam && !roleCreate)}
                onClick={() => submitForm(currentLang)}
              >
                <SaveOutlined />
                {t('system.save')}
              </Button>
            )}
          </Space>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Row gutter={16}>
          <Col xxl={18} xl={16} lg={16}>
            <Card
              type="inner"
            >
              <div className="site-card-border-less-wrapper">
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
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
                          defaultValue={(detailPage?.translations || {})[`${currentLang}`]?.title}
                          control={mainMethod.control}
                          render={({
                            field: { value, onChange },
                            fieldState: { error },
                          }) => (
                            <Input
                              className="u-mt-8"
                              name="title"
                              value={value}
                              onChange={(e) => {
                                onChange(e);
                                if (!idParam || !(detailPage?.translations || {})[`${currentLang}`]?.slug) {
                                  mainMethod.setValue('slug', generateSlug(e.currentTarget.value));
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
                          defaultValue={(detailPage?.translations || {})[`${currentLang}`]?.slug}
                          control={mainMethod.control}
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
                </Space>
              </div>
            </Card>
            <div className="p-editPageTemplate">
              <RenderTemplate
                ref={templateRef}
                data={templateSelected ? templatePage?.blocks : undefined}
                loading={loadingTemplate || loadingPage}
                defaultValues={detailPage?.blocks}
              />
              <SeoSection
                canCreateComment={getPermission(rolesUser, roles.PAGE_COMMENT_STORE)}
                defaultValues={defaultValueSEO}
                ref={seoSectionRef}
                socialList={socialList}
              />
            </div>
          </Col>
          <Col xxl={6} xl={8} lg={8}>
            <Sidebar
              status={status || 1}
              ref={pageHeaderSectionRef}
              pageTemplates={listTemplate}
              parents={listParent}
              createdDate={detailPage ? moment(detailPage?.pageData.createdAt).fromNow() : ''}
              createdBy={detailPage?.creator?.name || ''}
              lastUpdated={detailPage ? moment(detailPage.pageData.updatedAt).fromNow() : ''}
              lastUpdatedBy={detailPage?.updater?.name || ''}
              languageList={languageOptions}
              currentLang={currentLang}
              handleChangeLang={handleChangeLanguage}
              handleChangeTemplate={handleChangeTemplate}
              handleOpenPreview={() => {
                seoSectionRef.current?.handleOpenBrowserPreview();
              }}
              handleOpenSocialPreview={() => {
                seoSectionRef.current?.handleOpenSocialPreview();
              }}
              commentList={commentsList}
              handleSeeMoreComment={handleLoadMoreComments}
            />
          </Col>
        </Row>
      </div>
      <ModalConfirm
        isShow={!!confirm}
        handleCancel={() => setConfirm(undefined)}
        handleConfirm={() => changeLanguageAction(confirm)}
        handleClose={() => setConfirm(undefined)}
      >
        {t('message.confirmSkipInfo')}
      </ModalConfirm>
    </>
  );
};

export default EditPageTemplate;
