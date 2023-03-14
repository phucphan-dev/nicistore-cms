import {
  ArrowDownOutlined, ArrowUpOutlined, DeleteOutlined, PlusOutlined, SaveOutlined
} from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, Card, Col, Collapse, message, Modal, Radio, Row, Select, Space, Spin, Typography
} from 'antd';
import moment from 'moment';
import React, {
  useEffect, useMemo, useRef, useState
} from 'react';
import {
  Controller, FormProvider, useFieldArray, useForm
} from 'react-hook-form';
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
import SelectFile from 'common/components/SelectFile';
import CommentList, { CommentItem } from 'common/components/SeoPlugin/CommentList';
import CommentForm, { CommentSectionRef } from 'common/components/SeoSection/CommentForm';
import {
  createBannerCommentService,
  createBannerService, getBannerByIdService, getBannerCommentService, updateBannerService
} from 'common/services/banners';
import { CreateBannerCommentParams, CreateBannerParamsTypes } from 'common/services/banners/types';
import { ROUTE_PATHS, videoTypes } from 'common/utils/constant';
import { bannerCreateSchema } from 'common/utils/schemas';
import roles, { getPermission } from 'configs/roles';

type BannerDataItemTypes = {
  type: BannerType;
  data: {
    title?: string;
    subTitle?: string;
    link?: string;
    imageDesktop?: string;
    imageTabLet?: string;
    imageMobile?: string;
    videoType?: string;
    videoUrl?: string;
    videoThumbnail?: string;
  }
};

type BannerDataForm = {
  name: string;
  items: BannerDataItemTypes[];
};

const EditBanner: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate }) => {
  /* Hooks */
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);

  /* Variables */
  const idParams = Number(searchParams.get('id'));
  const localeParams = searchParams.get('locale') || defaultWebsiteLanguage || '';

  /* States */
  const [currentLang, setCurrentLang] = useState(localeParams);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [active, setActive] = useState(-1);
  const [isVideos, setIsVideos] = useState<boolean[]>([]);
  const [typeVideos, setTypeVideos] = useState<(string | undefined)[]>([]);

  /* Refs */
  const commentSectionRef = useRef<CommentSectionRef>(null);

  /* React-hook-form */
  const method = useForm<BannerDataForm>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(bannerCreateSchema),
  });

  const { isDirty, } = method.formState;

  const {
    fields, append, move, remove
  } = useFieldArray({
    control: method.control,
    name: 'items'
  });

  /* React-query */
  /**
 * Get Banner Data By Id
 */
  const { data: bannerData, isLoading: bannerDataLoading } = useQuery(
    ['getBannerById', { idParams, currentLang }],
    () => {
      if (idParams) {
        return getBannerByIdService(idParams);
      }
      return undefined;
    },
  );

  /**
   * Create & Update Banner Service
   */
  const { mutate: createBannerMutate, isLoading: createLoading } = useMutation(
    'createBannerAction',
    async (params: CreateBannerParamsTypes) => createBannerService(params),
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigate(`${ROUTE_PATHS.BANNER_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );
  const { mutate: updateBannerMutate, isLoading: updateLoading } = useMutation(
    'updateBannerAction',
    async (params:
      { id: number, data: CreateBannerParamsTypes }) => updateBannerService(params.id, params.data),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries('getBannerById');
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const {
    data: commentsListRes,
    isFetching: commentsListLoading,
    hasNextPage: commentListHasNextPage,
    fetchNextPage: commentsListLoadMore
  } = useInfiniteQuery(
    ['banner-comments', { currentLang, idParams }],
    ({ pageParam = 1 }) => getBannerCommentService(
      {
        bannerId: idParams,
        locale: currentLang,
        page: pageParam,
      }
    ),
    {
      enabled: getPermission(rolesUser, roles.BANNER_COMMENT_INDEX) && !!idParams,
      getNextPageParam: (lastPage) => (
        lastPage.meta.page < lastPage.meta.totalPages
          ? lastPage.meta.page + 1 : undefined),
    },
  );

  const { mutate: createCommentMutate, isLoading: createCommentLoading } = useMutation(
    ['banner-comments-create'],
    async (params: CreateBannerCommentParams) => createBannerCommentService(params),
    {
      onSuccess: () => {
        message.success(t('message.createCommentSuccess'));
        queryClient.invalidateQueries(['banner-comments', { currentLang, idParams }]);
        commentSectionRef.current?.clearCommentForm();
      },
      onError: () => {
        message.error(t('message.createCommentError'));
      }
    }
  );

  /* Datas */
  const commentsList = useMemo(() => {
    if (commentsListRes) {
      let list: CommentItem[] = [];
      commentsListRes.pages.forEach((ele) => {
        const commentDataList = ele.data?.map((item) => ({
          id: item.bannerCommentData.id,
          content: item.bannerCommentData.comment,
          commentName: item.updater.name,
          time: item.bannerCommentData.updatedAt,
        })) || [];
        list = [...list, ...commentDataList];
      });
      return list;
    }
    return [];
  }, [commentsListRes]);

  /* INIT FORM VALUE */
  useEffect(() => {
    if (bannerData && currentLang) {
      const data = bannerData.translations[currentLang];
      method.reset({
        name: data ? data.name : '',
        items: data ? data.items.map((val) => ({
          type: val.type,
          data: val.data
        })) : []
      });
      setIsVideos(data ? data.items.map((val) => val.type === 'video') : []);
      setTypeVideos(data ? data.items.map((val) => val.data.videoType) : []);
    }
  }, [bannerData, currentLang, method]);

  useEffect(() => {
    if (active > -1) {
      method.reset({ name: method.getValues('name'), items: fields });
    }
  }, [active, fields, method]);

  useEffect(() => {
    setTimeout(() => {
      setActive(-1);
    }, 1000);
  }, [active]);

  const onSubmit = (data: BannerDataForm) => {
    const commentForm = commentSectionRef.current?.handleCommentForm();

    if (commentForm?.comment) {
      createCommentMutate({ bannerId: idParams, comment: commentForm.comment });
    }
    const params: CreateBannerParamsTypes = {
      translations: {
        [currentLang]: {
          bannerData: {
            name: data.name,
            items: data.items.map((item) => ({
              type: item.type,
              data: item.type === 'video'
                ? item.data
                : {
                  title: item.data.title,
                  subTitle: item.data.subTitle,
                  link: item.data.link,
                  imageDesktop: item.data.imageDesktop,
                  imageTabLet: item.data.imageTabLet,
                  imageMobile: item.data.imageMobile,
                }
            }))
          }
        }
      }
    };

    if (idParams) {
      updateBannerMutate({
        id: idParams,
        data: params
      });
    } else createBannerMutate(params);
  };

  /**
   * Handle Change Languages
   */

  const updateLangeState = (val: string) => {
    setCurrentLang(val);
    setSearchParams({
      id: String(idParams),
      locale: val,
    });
    setConfirm(undefined);
  };

  // const confirmSaveData = () => {
  //   const params: any = {
  //     translations: {
  //       [currentLang]: {
  //         bannerData: {
  //           name: method.getValues('name') || '',
  //           items: method.getValues('items') || [],
  //         }
  //       }
  //     }
  //   };
  //   if (idParams) {
  //     const fieldName = method.getValues('name');
  //     bannerCreateSchema.fields.name
  //       .validate(fieldName)
  //       .then(() => {
  //         method.reset();
  //         updateBannerMutate({
  //           id: idParams,
  //           data: params
  //         });
  //         if (confirm) {
  //           updateLangeState(confirm);
  //         }
  //       })
  //       .catch(() => {
  //         // empty
  //       })
  //       .finally(() => {
  //         setConfirm(undefined);
  //       });
  //   } else {
  //     method.reset();
  //     createBannerMutate(params);
  //     if (confirm) {
  //       updateLangeState(confirm);
  //     }
  //     setConfirm(undefined);
  //   }
  // };

  // const dontSaveData = () => {
  //   method.reset();
  //   if (confirm) {
  //     updateLangeState(confirm);
  //   }
  //   setConfirm(undefined);
  // };

  const handleChangeLanguage = (val: string) => {
    if (isDirty) {
      setConfirm(val);
    } else {
      method.reset();
      updateLangeState(val);
    }
  };

  const handleLoadMoreComments = () => {
    if (commentListHasNextPage) {
      commentsListLoadMore();
    }
  };

  return (
    <>
      <HeaderPage
        fixed
        title="Banner"
        rightHeader={(
          <Button
            disabled={(idParams && !roleUpdate) || (!idParams && !roleCreate)}
            type="primary"
            loading={createLoading || updateLoading || createCommentLoading}
            onClick={method.handleSubmit(onSubmit)}
          >
            <SaveOutlined />
            {t('system.save')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <FormProvider {...method}>
          <Row gutter={16}>
            <Col xxl={18} xl={16} lg={16}>
              <Spin spinning={createLoading || bannerDataLoading || updateLoading || commentsListLoading} size="large">
                <div>
                  <Card>
                    <Typography.Text strong>
                      {t('system.name')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="name"
                      defaultValue=""
                      render={({
                        field: { value, onChange },
                        fieldState: { error },
                      }) => (
                        <Input
                          className="u-mt-8"
                          name="name"
                          value={value}
                          onChange={onChange}
                          error={error?.message}
                          size="large"
                        />
                      )}
                    />
                  </Card>
                </div>
                <div className="u-mt-32">
                  <Collapse defaultActiveKey={[0]}>
                    {fields.map((ele, index) => (
                      <Collapse.Panel
                        // eslint-disable-next-line react/no-array-index-key
                        key={index.toString()}
                        forceRender
                        className={active === index ? 'repeaterActive' : undefined}
                        header={(
                          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Typography.Title
                              level={5}
                            >
                              {ele.data.title}
                            </Typography.Title>
                            <Space size={8}>
                              <Button
                                type="text"
                                disabled={index === 0}
                                onClick={(e) => {
                                  if (e.stopPropagation) e.stopPropagation();
                                  move(index, index - 1);
                                  setActive(index - 1);
                                }}
                                icon={(<ArrowUpOutlined />)}
                              />
                              <Button
                                type="text"
                                disabled={index === fields.length - 1}
                                onClick={(e) => {
                                  if (e.stopPropagation) e.stopPropagation();
                                  move(index, index + 1);
                                  setActive(index + 1);
                                }}
                                icon={(<ArrowDownOutlined />)}
                              />
                              <Button
                                type="text"
                                onClick={(e) => {
                                  if (e.stopPropagation) e.stopPropagation();
                                  Modal.confirm({
                                    className: 't-pagetable_deleteLanguageModal',
                                    autoFocusButton: 'cancel',
                                    okText: t('system.ok'),
                                    cancelText: t('system.cancel'),
                                    cancelButtonProps: {
                                      type: 'primary',
                                    },
                                    okButtonProps: {
                                      type: 'default',
                                    },
                                    title: t('message.confirmDeleteRecord'),
                                    onOk: () => remove(index),
                                  });
                                }}
                                icon={(<DeleteOutlined />)}
                              />
                            </Space>
                          </Space>
                        )}
                      >
                        <Card type="inner" className="u-mt-16">
                          <div className="u-mb-16">
                            <Typography.Text strong>
                              {t('banner.bannerType')}
                            </Typography.Text>
                            <div className="u-mt-8">
                              <Controller
                                name={`items[${index}].type`}
                                render={({
                                  field: { value, onChange },
                                }) => (
                                  <Radio.Group
                                    onChange={(e) => {
                                      onChange(e);
                                      const temp = isVideos.slice();
                                      temp[index] = e.target.value === 'video';
                                      setIsVideos(temp);
                                    }}
                                    value={value}
                                  >
                                    <Radio value="basic">Image</Radio>
                                    <Radio value="video">Video</Radio>
                                  </Radio.Group>
                                )}
                              />
                            </div>
                          </div>
                          <Typography.Text strong>
                            {t('system.title')}
                          </Typography.Text>
                          <Controller
                            name={`items[${index}].data.title`}
                            render={({
                              field: { value, onChange },
                              fieldState: { error },
                            }) => (
                              <Input
                                className="u-mt-8"
                                name={`items[${index}].data.title`}
                                value={value}
                                onChange={onChange}
                                error={error?.message}
                                size="large"
                              />
                            )}
                          />
                          <div className="u-mt-16">
                            <Typography.Text strong>
                              {t('system.subTitle')}
                            </Typography.Text>
                            <Controller
                              name={`items[${index}].data.subTitle`}
                              render={({
                                field: { value, onChange },
                                fieldState: { error },
                              }) => (
                                <Input
                                  className="u-mt-8"
                                  name={`items[${index}].data.subTitle`}
                                  value={value}
                                  onChange={onChange}
                                  error={error?.message}
                                  size="large"
                                />
                              )}
                            />
                          </div>
                          <div className="u-mt-16">
                            <Typography.Text strong>
                              {t('header.link')}
                            </Typography.Text>
                            <Controller
                              name={`items[${index}].data.link`}
                              render={({
                                field: { value, onChange },
                                fieldState: { error },
                              }) => (
                                <Input
                                  className="u-mt-8"
                                  name={`items[${index}].data.link`}
                                  value={value}
                                  onChange={onChange}
                                  error={error?.message}
                                  size="large"
                                />
                              )}
                            />
                          </div>
                          {!isVideos[index] && (
                            <Row gutter={8} className="u-mt-16">
                              <Col span={8}>
                                <Controller
                                  name={`items[${index}].data.imageDesktop`}
                                  render={({
                                    field: { value, onChange },
                                  }) => (
                                    <SelectFile
                                      value={value}
                                      name={`items[${index}].data.imageDesktop`}
                                      handleSelect={(url) => onChange(url)}
                                      handleDelete={() => onChange(undefined)}
                                      title={t('banner.imageDesktop')}
                                    />
                                  )}
                                />
                              </Col>
                              <Col span={8}>
                                <Controller
                                  name={`items[${index}].data.imageTabLet`}
                                  render={({
                                    field: { value, onChange },
                                  }) => (
                                    <SelectFile
                                      value={value}
                                      name={`items[${index}].data.imageTabLet`}
                                      handleSelect={(url) => onChange(url)}
                                      handleDelete={() => onChange(undefined)}
                                      title={t('banner.imageTablet')}
                                    />
                                  )}
                                />
                              </Col>
                              <Col span={8}>
                                <Controller
                                  name={`items[${index}].data.imageMobile`}
                                  render={({
                                    field: { value, onChange },
                                  }) => (
                                    <SelectFile
                                      value={value}
                                      name={`items[${index}].data.imageMobile`}
                                      handleSelect={(url) => onChange(url)}
                                      handleDelete={() => onChange(undefined)}
                                      title={t('banner.imageMobile')}
                                    />
                                  )}
                                />
                              </Col>
                            </Row>
                          )}
                          {isVideos[index] && (
                            <Row gutter={8} className="u-mt-16">
                              <Col span={8}>
                                <Typography.Text strong>
                                  {t('banner.videoType')}
                                  {' '}
                                  <Typography.Text strong type="danger">
                                    *
                                  </Typography.Text>
                                </Typography.Text>
                                <Controller
                                  name={`items[${index}].data.videoType`}
                                  render={({
                                    field: { value, onChange },
                                    fieldState: { error },
                                  }) => (
                                    <>
                                      <Select
                                        className="u-mt-8"
                                        size="large"
                                        style={{ width: '100%' }}
                                        onChange={(val) => {
                                          onChange(val);
                                          const temp = typeVideos.slice();
                                          temp[index] = val;
                                          setTypeVideos(temp);
                                        }}
                                        value={value}
                                      >
                                        {
                                          videoTypes.map((val, idx) => (
                                            <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                              {val.label}
                                            </Select.Option>
                                          ))
                                        }
                                      </Select>
                                      {error && (
                                        <span className="a-input_errorMessage">
                                          {error.message}
                                        </span>
                                      )}
                                    </>
                                  )}
                                />
                              </Col>
                              {typeVideos[index] && (
                                <Col span={8}>
                                  <Controller
                                    name={`items[${index}].data.videoUrl`}
                                    render={({
                                      field: { value, onChange },
                                      fieldState: { error },
                                    }) => (typeVideos[index] === 'upload' ? (
                                      <>
                                        <SelectFile
                                          value={value}
                                          name={`items[${index}].data.videoUrl`}
                                          handleSelect={(url) => onChange(url)}
                                          handleDelete={() => onChange(undefined)}
                                          title={t('banner.videoUrl')}
                                          isRequired
                                          notImage
                                        />
                                        {error && (
                                          <span className="a-input_errorMessage">
                                            {error.message}
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <Typography.Text strong>
                                          {t('banner.videoUrl')}
                                          {' '}
                                          <Typography.Text strong type="danger">
                                            *
                                          </Typography.Text>
                                        </Typography.Text>
                                        <Input
                                          className="u-mt-8"
                                          name={`items[${index}].data.videoUrl`}
                                          value={value}
                                          onChange={onChange}
                                          size="large"
                                          required
                                          error={error?.message}
                                        />
                                      </>
                                    ))}
                                  />
                                </Col>
                              )}
                              <Col span={8}>
                                <Controller
                                  name={`items[${index}].data.videoThumbnail`}
                                  render={({
                                    field: { value, onChange },
                                    fieldState: { error },
                                  }) => (
                                    <>
                                      <SelectFile
                                        value={value}
                                        name={`items[${index}].data.videoThumbnail`}
                                        handleSelect={(url) => onChange(url)}
                                        handleDelete={() => onChange(undefined)}
                                        title={t('banner.videoThumbnail')}
                                        isRequired
                                      />
                                      {error && (
                                        <span className="a-input_errorMessage">
                                          {error.message}
                                        </span>
                                      )}

                                    </>
                                  )}
                                />
                              </Col>
                            </Row>
                          )}
                        </Card>
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                  <Button type="primary" className="btn-center u-mt-24" onClick={() => append({ type: 'basic', data: { title: '', subTitle: '', link: '' } })}>
                    <PlusOutlined />
                    {t('system.addNew')}
                  </Button>
                </div>
                {getPermission(rolesUser, roles.BANNER_COMMENT_STORE) && (
                  <div className="seoSection">
                    <div className="seoSection_label">
                      {t('dashboard.others')}
                    </div>
                    <CommentForm ref={commentSectionRef} />
                  </div>
                )}
              </Spin>
            </Col>
            <Col xxl={6} xl={8} lg={8}>
              <ManagementInfo
                createdDate={bannerData ? moment(bannerData.bannerData.createdAt).fromNow() : ''}
                lastUpdated={bannerData ? moment(bannerData.bannerData.updatedAt).fromNow() : ''}
                createdBy={bannerData ? bannerData.creator.name : ''}
                lastUpdatedBy={bannerData ? bannerData.updater.name : ''}
                languageList={languageOptions}
                currentLang={currentLang}
                handleChangeLang={(value) => value && handleChangeLanguage(value)}
              />
              <CommentList
                commentList={commentsList}
                handleSeeMoreComment={handleLoadMoreComments}
              />
            </Col>
          </Row>
        </FormProvider>
        <ModalConfirm
          isShow={!!confirm}
          handleCancel={() => setConfirm(undefined)}
          handleConfirm={() => confirm && updateLangeState(confirm)}
          handleClose={() => setConfirm(undefined)}
        >
          {t('message.confirmSave')}
        </ModalConfirm>
      </div>
    </>
  );
};

export default EditBanner;
