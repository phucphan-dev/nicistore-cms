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
import Editor from 'common/components/Editor';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import CommentList, { CommentItem } from 'common/components/SeoPlugin/CommentList';
import CommentForm, { CommentSectionRef } from 'common/components/SeoSection/CommentForm';
import StatusLabel, { StatusButtons } from 'common/components/StatusLabel';
import {
  createFaqCommentService,
  createFaqService,
  getFaqByIdService,
  getFaqCommentService,
  updateFaqService,
  updateStatusFaqService
} from 'common/services/faqs';
import { CreateFaqCommentParams, CreateFaqParamsTypes } from 'common/services/faqs/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { updateFaqByIdSchema } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

export type NewsFormTypes = {
  displayOrder: number;
  answer: string;
  question: string;
  faqCategoryId?: number[];
};

const defaultValues = {
  displayOrder: 1,
  answer: '',
  question: '',
};

const EditFaq: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate, roleOther }) => {
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
  const [currentLang, setCurrentLang] = useState<string>(
    localeParams
  );
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<number>(1);

  /* Refs */
  const commentSectionRef = useRef<CommentSectionRef>(null);

  /* React-hook-form */
  const method = useForm<NewsFormTypes>({
    resolver: yupResolver(updateFaqByIdSchema),
    defaultValues
  });

  const { isDirty } = method.formState;

  /* Queries */
  const { data: newsByIdData, isLoading } = useQuery(
    ['getFaqById', currentLang, idParams],
    () => {
      if (idParams) {
        return getFaqByIdService({
          id: idParams,
          locale: currentLang
        });
      }
      return undefined;
    }
  );

  const { mutate: updateFaqByIdMutate, isLoading: updateLoading } = useMutation(
    ['updateFaqById', currentLang, idParams],
    async (data: {
      id: number;
      params: CreateFaqParamsTypes
    }) => updateFaqService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createFaqByIdMutate, isLoading: createLoading } = useMutation(
    'createFaq',
    createFaqService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.FAQ_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  const { mutate: updateStatusMutate, isLoading: updateStatusLoading } = useMutation(
    'updateFaqStatus',
    async (data: {
      id: number, statusId: number
    }) => updateStatusFaqService(data.id, data.statusId),
    {
      onSuccess: (_, params) => {
        setStatus(params.statusId);
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['getFaqById', currentLang, idParams]);
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
    ['faq-comments', { currentLang, idParams }],
    ({ pageParam = 1 }) => getFaqCommentService(
      {
        faqId: idParams,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.FAQ_COMMENT_INDEX) && !!idParams,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: createCommentMutate, isLoading: createCommentLoading } = useMutation(
    ['faq-comments-create'],
    async (params: CreateFaqCommentParams) => createFaqCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['faq-comments', { currentLang, idParams }]);
        commentSectionRef.current?.clearCommentForm();
      },
      onError: () => {
        message.error(t('message.createCommentError'));
      }
    }
  );

  /* Functions */
  const handleComment = (faqsIdParam: number) => {
    const commentForm = commentSectionRef.current?.handleCommentForm();

    if (commentForm?.comment) {
      createCommentMutate({ faqId: faqsIdParam, comment: commentForm.comment });
    }
  };

  const onSubmit = async (addingFn?: (id: number) => void) => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const newsParams = {
      displayOrder: formData.displayOrder,
      faqCategoryId: formData.faqCategoryId,
      translations: {
        [currentLang]: {
          faqData: {
            answer: formData.answer,
            question: formData.question,
          },
        }
      },
    };
    if (idParams) {
      updateFaqByIdMutate({
        id: idParams,
        params: newsParams
      });
    } else {
      createFaqByIdMutate(newsParams, {
        onSuccess: (data) => addingFn && addingFn(data.id),
      });
    }
  };

  const changeLanguageAction = async (lang?: string) => {
    setConfirm(undefined);
    if (lang) {
      setCurrentLang(lang as LanguageCodeTypes);
      setSearchParams({
        id: String(idParams),
        locale: lang,
      }, { replace: true });
    }
  };

  const handleChangeLang = async (lang: LanguageCodeTypes) => {
    if (isDirty && Object.keys(method.formState.dirtyFields).length > 0) {
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
      if (isDirty) {
        await onSubmit();
      }
      updateStatusMutate({ id: idParams, statusId: stat });
      handleComment(idParams);
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
    queryClient.invalidateQueries(['getFaqById', currentLang, idParams]);
  };

  /* Datas */
  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.faqCommentData.id,
          content: item.faqCommentData.comment,
          commentName: item.updater.name,
          time: item.faqCommentData.updatedAt,
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
      setStatus(newsByIdData.faqData.status);

      const {
        answer, question,
      } = newsByIdData.translations[currentLang];
      const objDefault = {
        answer,
        question,
        displayOrder: newsByIdData.faqData.displayOrder,
        faqCategoryId: newsByIdData.faqCategories?.map((item) => item[currentLang]?.id),
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
        title={idParams ? t('faqDetail.editFaq') : t('faqDetail.createFaq')}
        rightHeader={(
          <Space size={16}>
            {status && (
              <StatusButtons
                loading={updateStatusLoading}
                status={status}
                isApprove={roleOther.includes(roles.FAQ_APPROVED)}
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
                <Space direction="vertical" size={20}>
                  <Card type="inner">
                    <div className="site-card-border-less-wrapper">
                      <Space direction="vertical" size={12} style={{ width: '100%' }}>
                        <div style={{ width: '50%' }}>
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
                        {/* Câu hỏi  */}
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('faqDetail.question')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="question"
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
                        {/* Trả lời  */}
                        <div className="p-editPageTemplate_input">
                          <div style={{ marginBottom: 8 }}>
                            <Typography.Text strong>
                              {t('faqDetail.answer')}
                              {' '}
                            </Typography.Text>
                            <Typography.Text strong type="danger">
                              *
                            </Typography.Text>
                          </div>
                          <Controller
                            name="answer"
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
                {getPermission(rolesUser, roles.FAQ_COMMENT_STORE) && (
                  <div className="seoSection">
                    <div className="seoSection_label">
                      {t('dashboard.others')}
                    </div>
                    <CommentForm ref={commentSectionRef} />
                  </div>
                )}
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <div className="u-mb-16">
                  {status && <StatusLabel status={status} bigger />}
                </div>
                <Card className="u-mb-16">
                  {/* Phân loại */}
                  <div className="p-editPageTemplate_input">
                    <Typography.Text strong>
                      {t('faqDetail.categories')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="faqCategoryId"
                      control={method.control}
                      render={({ field, fieldState }) => (
                        <>
                          <DropdownElement
                            type="faqCategory"
                            placeholder={`${t('system.select')} ${t('faqDetail.categories')}`}
                            locale={currentLang}
                            value={field.value}
                            onChange={field.onChange}
                            multiple={{}}
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
                </Card>
                <ManagementInfo
                  classNameCustom="u-mt-16"
                  createdDate={newsByIdData ? moment(newsByIdData.faqData.createdAt).fromNow() : ''}
                  createdBy={newsByIdData?.creator.name || ''}
                  lastUpdated={newsByIdData ? moment(newsByIdData.faqData.updatedAt).fromNow() : ''}
                  lastUpdatedBy={newsByIdData?.updater.name || ''}
                  languageList={languageOptions}
                  currentLang={currentLang}
                  handleChangeLang={
                    (value) => value && handleChangeLang(value as LanguageCodeTypes)
                  }
                />
                <CommentList
                  commentList={commentsList}
                  handleSeeMoreComment={handleLoadMoreComments}
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

export default EditFaq;
