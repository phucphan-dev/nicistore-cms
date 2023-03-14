import { SaveOutlined } from '@ant-design/icons';
import {
  Button, Col, Collapse, CollapsePanelProps, message, Row, Typography
} from 'antd';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  useSearchParams
} from 'react-router-dom';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import { getErrorConfigService, saveErrorConfigService } from 'common/services/systems';
import { SaveErrorConfigParams } from 'common/services/systems/types';
import { delay } from 'common/utils/functions';
import roles, { getPermission } from 'configs/roles';
import { RenderBlock, RenderBlockRefs } from 'features/EditPageTemplate/RenderUI/RenderTemplate';

const ERROR_CODES_LIST = ['400', '403', '404', '429', '500'];

export type ErrorTemplateRef = {
  handleSectionSubmit: () => any | undefined;
  isFormDirty: () => boolean;
  changeLanguageState: (language: string) => void;
};

export type ErrorTemplateProps = {
  activeKey: number;
  code: string;
  currentLang: string;
} & Omit<CollapsePanelProps, 'header' | 'key'>;

const ErrorTemplate = forwardRef<
  ErrorTemplateRef, ErrorTemplateProps
>(({
  code, currentLang, activeKey, ...panelProps
}, ref) => {
  /* Hooks */
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* States */
  const [loading, setLoading] = useState(false);

  /* React-query */
  const { data: configData, isLoading: loadingData } = useQuery(
    ['getErrorConfig', code],
    () => getErrorConfigService(code),
  );

  const { mutate: updateMutate, isLoading: updateLoading } = useMutation(
    ['updateErrorConfig', code],
    async (
      formData: SaveErrorConfigParams,
    ) => saveErrorConfigService((code), {
      translations: { [`${currentLang}`]: { blocks: formData } }
    }),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        queryClient.invalidateQueries(['getErrorConfig', code]);
      },
      onError: () => {
        message.error(t('message.updateError'));
      }
    }
  );

  /* Refs */
  const itemsRef = useRef<Array<RenderBlockRefs>>(
    configData?.elements ? Object.keys(configData?.elements).map(
      (item) => ({ sectionName: item, ref: null })
    ) : []
  );

  /* Datas */
  const sections = useMemo(() => {
    if (configData?.elements) {
      return Object.entries(configData?.elements);
    }
    return [];
  }, [configData?.elements]);

  /* Functions */
  const handleFormSubmit: any = () => {
    let obj = {};
    itemsRef.current.forEach((ele) => {
      obj = { ...obj, [ele.sectionName]: ele.ref?.handleForm() };
    });
    return obj;
  };

  const checkIsDirty = () => {
    const filter = itemsRef.current.filter((item) => item.ref?.isFormDirty());
    return filter.length > 0;
  };

  const onSubmit = () => {
    const formData = handleFormSubmit();
    updateMutate(formData);
  };

  const onLanguageChange = async (language: string) => {
    if (!configData?.data[language]) {
      setLoading(true);
      await delay(1000);
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.stopPropagation();
    onSubmit();
  };

  useImperativeHandle(ref, () => ({
    handleSectionSubmit: () => onSubmit(),
    isFormDirty: () => checkIsDirty() || false,
    changeLanguageState: onLanguageChange
  }));

  return (
    <Collapse.Panel
      {...panelProps}
      key={activeKey}
      forceRender
      header={(
        <Typography.Title
          level={5}
        >
          {t(`system.error${code}`)}
        </Typography.Title>
      )}
      extra={(
        <Button
          type="primary"
          loading={updateLoading}
          onClick={handleSubmit}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <SaveOutlined />
          {t('system.save')}
        </Button>
      )}
    >
      {(loading || loadingData) ? null : sections.map((ele, i) => (
        <RenderBlock
          key={`render-block-${ele[0]}`}
          ref={(el) => {
            if (el) {
              itemsRef.current[i] = {
                sectionName: ele[0],
                ref: el
              };
            }
          }}
          label={t(ele[1].label)}
          section={ele[1].elements}
          defaultValues={configData?.data[currentLang]?.blocks[`${ele[0]}`]}
        />
      ))}
    </Collapse.Panel>
  );
});

const ErrorsManagement: React.FC<ActiveRoles> = () => {
  /* Hooks */
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);
  const rolesUser = useAppSelector((state) => state.auth.roles);
  const localeParam = searchParams.get('locale') || defaultWebsiteLanguage || '';

  /* Refs */
  const errorsTemplateRefs = useRef<Array<ErrorTemplateRef>>([]);

  /* States */
  const currentLang = useMemo(() => localeParam, [localeParam]);
  const [confirm, setConfirm] = useState<{
    lang?: string;
    dirtyFormRefs?: ErrorTemplateRef[];
  }>({
    lang: undefined,
    dirtyFormRefs: undefined,
  });

  /* Functions */
  const changeLanguageState = async (language: string) => {
    errorsTemplateRefs.current.forEach((eleRef) => eleRef?.changeLanguageState(language));
    setSearchParams({
      locale: language,
    });
  };

  const changeLanguageAction = async (lang?: string, isSubmit?: boolean) => {
    if (lang) {
      if (isSubmit) {
        confirm.dirtyFormRefs?.forEach((eleRef) => eleRef.handleSectionSubmit());
      }
      setConfirm({
        lang: undefined,
        dirtyFormRefs: undefined,
      });
      changeLanguageState(lang);
    }
  };

  const handleChangeLanguage = async (language?: string) => {
    if (language) {
      const dirtyFormRefs = errorsTemplateRefs.current.filter((eleRef) => eleRef?.isFormDirty());
      if (dirtyFormRefs.length) {
        // Have Dirty field => confirm to save each ones
        setConfirm({
          lang: language,
          dirtyFormRefs
        });
      } else {
        // No Dirty field at all
        changeLanguageState(language);
      }
    }
  };

  return (
    <div className="p-errorManagement">
      <HeaderPage
        fixed
        title={`${t('sidebar.errorsManagement')}`}
      />
      <div className="t-mainlayout_wrapper">
        <Row gutter={16}>
          <Col xxl={18} xl={16} lg={16}>
            <div className="t-repeatersection">
              <Collapse className="u-mt-32 u-mb-24 t-repeatersection_collapse" defaultActiveKey={[0]}>
                {
                  ERROR_CODES_LIST.map((code, idx) => {
                    if (!getPermission(
                      rolesUser,
                      roles[`ERROR_PAGE_${code}` as keyof typeof roles]
                    )) {
                      return null;
                    }
                    return (
                      <ErrorTemplate
                        activeKey={idx}
                        ref={(innerRef) => {
                          if (innerRef) {
                            errorsTemplateRefs.current[idx] = innerRef;
                          }
                        }}
                        code={code}
                        currentLang={currentLang}
                      />
                    );
                  })
                }
              </Collapse>
            </div>
          </Col>
          <Col xxl={6} xl={8} lg={8}>
            <ManagementInfo
              createdDate=""
              createdBy="Admin"
              lastUpdated=""
              lastUpdatedBy="Admin"
              languageList={languageOptions}
              currentLang={currentLang}
              handleChangeLang={handleChangeLanguage}
            />
          </Col>
        </Row>
      </div>
      <ModalConfirm
        isShow={!!confirm.lang}
        handleCancel={() => setConfirm({
          lang: undefined,
        })}
        handleConfirm={() => changeLanguageAction(confirm.lang)}
        handleClose={() => setConfirm({
          lang: undefined,
          dirtyFormRefs: undefined,
        })}
      >
        {t('message.confirmSave')}
      </ModalConfirm>
    </div>
  );
};

export default ErrorsManagement;
