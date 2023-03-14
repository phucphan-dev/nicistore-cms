import { SaveOutlined } from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Card,
  Col, message, Row, Select, Space, Spin, Typography
} from 'antd';
import moment from 'moment';
import React, {
  useEffect, useMemo, useRef, useState
} from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import Input from 'common/components/Input';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import {
  createStaticBlockService, getDetailStaticBlockService,
  getStaticBlockTemplateService, updateStaticBlockService
} from 'common/services/staticBlock';
import { CreateStaticBlockParams } from 'common/services/staticBlock/types';
import { ROUTE_PATHS } from 'common/utils/constant';
import { delay } from 'common/utils/functions';
import { staticBlocksMainData } from 'common/utils/schemas';
import RenderTemplate, { RenderTemplateRef } from 'features/EditPageTemplate/RenderUI/RenderTemplate';

type MainDataTypes = {
  name: string;
  templateCode: string;
};

const EditStaticBlocks: React.FC<ActiveRoles> = ({ roleCreate, roleUpdate }) => {
  const mainMethod = useForm<MainDataTypes>({
    resolver: yupResolver(staticBlocksMainData),
    mode: 'onChange',
    defaultValues: {
      name: '',
      templateCode: ''
    }
  });

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  /* Hooks */
  const { t } = useTranslation();
  const navigator = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = Number(searchParams.get('id'));
  const localeParam = searchParams.get('locale') || defaultWebsiteLanguage || '';

  /* States */
  const [currentLanguage, setCurrentLanguage] = useState(localeParam);
  const [templateSelected, setTemplateSelected] = useState<string | undefined>(undefined);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  const templateRef = useRef<RenderTemplateRef>(null);
  /* Queries */
  const { data: allTemplate, isLoading: loadingAllTemplates } = useQuery(
    ['getAllStaticBlockTemplate'],
    () => getStaticBlockTemplateService(),
  );

  const { data: detailStaticBlock, isLoading: loadingDetail } = useQuery(
    ['getDetailStaticBlock', currentLanguage, idParam],
    () => {
      if (idParam) {
        return getDetailStaticBlockService(idParam, currentLanguage);
      }
      return undefined;
    }
  );

  const { mutate: updateStaticBlockByIdMutate, isLoading: updateLoading } = useMutation(
    'updateStaticBlockById',
    async (data: {
      id: number;
      params: CreateStaticBlockParams
    }) => updateStaticBlockService(data.id, data.params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  const { mutate: createStaticBlockMutate, isLoading: createLoading } = useMutation(
    'createStaticBlock',
    createStaticBlockService,
    {
      onSuccess: () => {
        message.success(t('message.createSuccess'));
        navigator(`${ROUTE_PATHS.STATIC_BLOCK_MANAGEMENT}`);
      },
      onError: () => {
        message.error(t('message.createError'));
      }
    }
  );

  /* Variables */
  const templatePage = useMemo(() => allTemplate?.find(
    (templ) => templ.code === templateSelected
  ), [allTemplate, templateSelected]);

  const listTemplate = useMemo(() => {
    const converter = allTemplate?.map(
      (item) => ({ value: item.code, label: item.name })
    ) || [];
    return [{ value: -1, label: '---' }, ...converter];
  }, [allTemplate]);

  /* Functions */
  const changeLanguageAction = async (lang?: string) => {
    if (lang) {
      setConfirm(undefined);
      setLoadingTemplate(true);
      await delay(1000);
      setCurrentLanguage(lang as LanguageCodeTypes);
      setSearchParams({
        id: String(idParam),
        locale: lang,
      });
      setLoadingTemplate(false);
    }
  };
  const handleChangeLanguage = async (language?: string) => {
    const result = await mainMethod.trigger();
    const isDirty = templateRef.current?.isFormDirty();
    if (!result || isDirty) {
      setConfirm(language);
    } else changeLanguageAction(language);
  };

  const handleSubmit = async (language: string) => {
    const result = await mainMethod.trigger();
    if (!result) {
      return;
    }

    const mainData = mainMethod.getValues();
    const dataTemplateForm = templateRef.current?.handleSubmit();

    const dataSubmit: CreateStaticBlockParams = {
      templateCode: mainData.templateCode,
      name: mainData.name,
      translations: {
        [language]: {
          blocks: dataTemplateForm
        }
      }
    };

    try {
      if (idParam) {
        updateStaticBlockByIdMutate({
          id: idParam,
          params: dataSubmit
        });
      } else {
        createStaticBlockMutate(dataSubmit);
      }
    } catch (error: any) {
      message.error(idParam ? t('message.updateError') : t('message.createError'));
    }
  };

  const submitForm = async (language: string) => {
    await handleSubmit(language);
  };

  /* Effects */
  useEffect(() => {
    if (detailStaticBlock) {
      setTemplateSelected(detailStaticBlock.template.code);
      mainMethod.reset({
        name: detailStaticBlock.staticBlockData.name,
        templateCode: detailStaticBlock.template.code
      });
    } else {
      mainMethod.reset();
      setTemplateSelected(undefined);
    }
  }, [detailStaticBlock, mainMethod]);

  /* Render */
  return (
    <div className="p-editStaticBlock">
      <HeaderPage
        fixed
        title={`${t('sidebar.staticBlocks')}`}
        rightHeader={(
          <Button
            type="primary"
            disabled={(idParam && !roleUpdate) || (!idParam && !roleCreate)}
            onClick={() => submitForm(currentLanguage)}
            loading={updateLoading || createLoading}
          >
            <SaveOutlined />
            {t('system.save')}
          </Button>
        )}
      />
      <div className="t-mainlayout_wrapper">
        <Row gutter={16}>
          <Col xxl={18} xl={16} lg={16}>
            {loadingAllTemplates || loadingDetail || loadingTemplate ? <Spin className="center-absolute" size="large" spinning />
              : (
                <>
                  <Card
                    type="inner"
                  >
                    <div className="site-card-border-less-wrapper">
                      <FormProvider {...mainMethod}>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                          <Row gutter={16}>
                            <Col span={12}>
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
                                  {t('system.sample')}
                                  {' '}
                                </Typography.Text>
                                <Typography.Text strong type="danger">
                                  *
                                </Typography.Text>
                                <Controller
                                  name="templateCode"
                                  control={mainMethod.control}
                                  render={({
                                    field,
                                    fieldState: { error }
                                  }) => (
                                    <>
                                      <Select
                                        className="u-mt-8"
                                        size="large"
                                        style={{ width: '100%' }}
                                        placeholder="---"
                                        onChange={(value) => {
                                          setTemplateSelected(value);
                                          field.onChange(value);
                                        }}
                                        value={field.value}
                                        status={error?.message ? 'error' : undefined}
                                      >
                                        {
                                          listTemplate.map((val, idx) => (
                                            <Select.Option value={val.value} key={`option-${idx.toString()}`}>
                                              {val.label}
                                            </Select.Option>
                                          ))
                                        }
                                      </Select>
                                      {error && (
                                        <span
                                          className="a-input_errorMessage"
                                        >
                                          {error.message}
                                        </span>
                                      )}
                                    </>
                                  )}
                                />
                              </div>
                            </Col>
                          </Row>
                        </Space>
                      </FormProvider>
                    </div>
                  </Card>
                  <div className="p-editPageTemplate">
                    <RenderTemplate
                      ref={templateRef}
                      data={templateSelected ? templatePage?.blocks : undefined}
                      loading={loadingAllTemplates || loadingDetail}
                      defaultValues={detailStaticBlock ? detailStaticBlock.blocks : undefined}
                    />
                  </div>
                </>

              )}
          </Col>
          <Col xxl={6} xl={8} lg={8}>
            <ManagementInfo
              createdDate={detailStaticBlock ? moment(detailStaticBlock?.staticBlockData.createdAt).fromNow() : ''}
              createdBy={detailStaticBlock?.creator.name || ''}
              lastUpdated={detailStaticBlock ? moment(detailStaticBlock?.staticBlockData.updatedAt).fromNow() : ''}
              lastUpdatedBy={detailStaticBlock?.updater.name || ''}
              languageList={languageOptions}
              currentLang={currentLanguage}
              handleChangeLang={handleChangeLanguage}
            />
          </Col>
        </Row>
      </div>
      <ModalConfirm
        isShow={!!confirm}
        handleCancel={() => { }}
        handleConfirm={() => { }}
        handleClose={() => setConfirm(undefined)}
      >
        {t('message.confirmSave')}
      </ModalConfirm>
    </div>
  );
};

export default EditStaticBlocks;
