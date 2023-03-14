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
import {
  useInfiniteQuery, useMutation, useQuery, useQueryClient
} from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import CommentList, { CommentItem } from 'common/components/SeoPlugin/CommentList';
import CommentForm, { CommentSectionRef } from 'common/components/SeoSection/CommentForm';
import StatusLabel, { StatusButtons } from 'common/components/StatusLabel';
import {
  createContactProblemCommentService,
  createContactProblemService,
  getContactProblemCommentService,
  getContactProblemService,
  updateContactProblemService,
  updateStatusContactProblemService,
} from 'common/services/contact';
import { CreateContactProblemCommentParams, UpdateContactProblemParams } from 'common/services/contact/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { updateContactProblemSchema } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

export type ContactProblemFormTypes = {
  displayOrder: string;
  name: string;
};

const defaultValues = {
  displayOrder: '0',
  name: '',
};

const ContactProblemDetail: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate, roleOther }) => {
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
  const method = useForm<ContactProblemFormTypes>({
    resolver: yupResolver(updateContactProblemSchema),
    defaultValues
  });

  const { isDirty } = method.formState;

  /* Queries */
  const { data: contactProblemByIdData, isLoading } = useQuery(
    ['contactProblem-detail', currentLang, idParams],
    () => {
      if (idParams) {
        return getContactProblemService({
          id: idParams,
          locale: currentLang
        });
      }
      return undefined;
    }
  );

  const { mutate: updateContactProblemByIdMutate, isLoading: updateLoading } = useMutation(
    ['contactProblem-update'],
    async (params: UpdateContactProblemParams) => updateContactProblemService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['contactProblem-detail', currentLang, idParams]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createContactProblemByIdMutate, isLoading: createLoading } = useMutation(
    ['contactProblem-create'],
    createContactProblemService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.CONTACT_PROBLEM_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  const { mutate: updateStatusMutate, isLoading: updateStatusLoading } = useMutation(
    'contactProblem-update-status',
    async (data: {
      id: number, statusId: number
    }) => updateStatusContactProblemService(data.id, data.statusId),
    {
      onSuccess: (_, params) => {
        setStatus(params.statusId);
        message.success(t('message.updateStatusSuccess'));
        queryClient.invalidateQueries(['contactProblem-detail', currentLang, idParams]);
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
    ['contactProblem-comments', { currentLang, idParams }],
    ({ pageParam = 1 }) => getContactProblemCommentService(
      {
        contactProblemId: idParams,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.CONTACT_PROBLEM_COMMENT_INDEX) && !!idParams,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: createCommentMutate, isLoading: createCommentLoading } = useMutation(
    ['contactProblem-comments-create'],
    async (params: CreateContactProblemCommentParams) => createContactProblemCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['contactProblem-comments', { currentLang, idParams }]);
        commentSectionRef.current?.clearCommentForm();
      },
      onError: () => {
        message.error(t('message.createCommentError'));
      }
    }
  );

  /* Functions */
  const handleComment = () => {
    const commentForm = commentSectionRef.current?.handleCommentForm();

    if (commentForm?.comment) {
      createCommentMutate({ contactProblemId: idParams, comment: commentForm.comment });
    }
  };

  const onSubmit = async (addingFn?: (id: number) => void) => {
    const isValid = await method.trigger();
    if (!isValid) {
      return;
    }
    const formData = method.getValues();
    const contactProblemParams = {
      displayOrder: formData.displayOrder,
      translations: {
        [currentLang]: {
          contactProblemData: {
            name: formData.name,
          },
        }
      },
    };
    if (idParams) {
      updateContactProblemByIdMutate({
        ...contactProblemParams,
        id: idParams,
      });
    } else {
      createContactProblemByIdMutate(contactProblemParams, {
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
        updateStatusMutate({ id, statusId: stat });
      });
    } else {
      if (isDirty) {
        await onSubmit();
      }
      updateStatusMutate({ id: idParams, statusId: stat });
    }
  };

  const submitForm = async () => {
    await onSubmit();
    handleComment();
    queryClient.invalidateQueries(['getCategoryById', currentLang, idParams]);
  };

  /* Datas */
  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.contactProblemCommentData.id,
          content: item.contactProblemCommentData.comment,
          commentName: item.updater.name,
          time: item.contactProblemCommentData.updatedAt,
        })) || [];
        list = [...list, ...commentDataList];
      });
      return list;
    }
    return [];
  }, [commentsListRes]);

  /* Effects */
  useEffect(() => {
    if (contactProblemByIdData && contactProblemByIdData.translations[currentLang]) {
      setStatus(contactProblemByIdData.contactProblemData.status);

      const {
        name,
      } = contactProblemByIdData.translations[currentLang];
      const objDefault = {
        name,
        displayOrder: contactProblemByIdData.contactProblemData.displayOrder,
      };
      method.reset(objDefault);
    } else {
      method.reset(defaultValues);
    }
  }, [contactProblemByIdData, currentLang, method]);

  /* Render */
  return (
    <>
      <HeaderPage
        fixed
        title={idParams ? t('contact.problemEdit') : t('contact.problemCreate')}
        rightHeader={(
          <Space size={16}>
            {status && (
              <StatusButtons
                loading={updateStatusLoading}
                status={status}
                isApprove={roleOther.includes(roles.CONTACT_PROBLEM_APPROVED)}
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
                        {/* Tên */}
                        <div className="p-editPageTemplate_input">
                          <Typography.Text strong>
                            {t('system.name')}
                            {' '}
                          </Typography.Text>
                          <Typography.Text strong type="danger">
                            *
                          </Typography.Text>
                          <Controller
                            name="name"
                            control={method.control}
                            render={({ field, fieldState: { error }, }) => (
                              <Input
                                {...field}
                                className="u-mt-8"
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                        </div>
                      </Space>
                    </div>
                  </Card>
                  {getPermission(rolesUser, roles.CONTACT_PROBLEM_COMMENT_STORE) && (
                    <div className="seoSection">
                      <div className="seoSection_label">
                        {t('dashboard.others')}
                      </div>
                      <CommentForm ref={commentSectionRef} />
                    </div>
                  )}
                </Space>
              </Col>
              <Col xxl={6} xl={8} lg={8}>
                <div className="u-mb-16">
                  {status && <StatusLabel status={status} bigger />}
                </div>
                <ManagementInfo
                  createdDate={contactProblemByIdData ? moment(contactProblemByIdData?.contactProblemData?.createdAt).fromNow() : ''}
                  createdBy={contactProblemByIdData?.creator.name || ''}
                  lastUpdated={contactProblemByIdData ? moment(contactProblemByIdData?.contactProblemData?.updatedAt).fromNow() : ''}
                  lastUpdatedBy={contactProblemByIdData?.updater.name || ''}
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
          {t('message.confirmSave')}
        </ModalConfirm>
      </div>
    </>
  );
};

export default ContactProblemDetail;
