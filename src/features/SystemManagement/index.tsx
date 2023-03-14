import { SaveOutlined } from '@ant-design/icons';
import {
  Button, Col, message, Row, Tabs
} from 'antd';
import React, {
  useMemo, useRef, useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';

import GeneralSM from './GeneralSM';
import LanguageSM from './LanguageSM';

import { useAppSelector } from 'app/store';
import HeaderPage from 'common/components/HeaderPage';
import ManagementInfo from 'common/components/ManagementInfo';
import ModalConfirm from 'common/components/ModalConfirm';
import SeoPlugin from 'common/components/SeoPlugin';
import SeoSection, { SeoSectionActionProps } from 'common/components/SeoSection';
import { SeoFormTypes } from 'common/components/SeoSection/types';
import useDidMount from 'common/hooks/useDidMount';
import { getSeoGeneralService, postSeoGeneralService } from 'common/services/systems';
import { SeoGeneralParamsTypes } from 'common/services/systems/types';
import { socialList } from 'common/utils/constant';
import { returnDefaultOG, returnOgData } from 'common/utils/functions';
import roles from 'configs/roles';

const SystemManagement: React.FC<ActiveRoles> = ({ roleOther }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  /* Selectors */
  const { languageOptions, defaultWebsiteLanguage } = useAppSelector((state) => state.system);

  const localeParam = searchParams.get('locale') || defaultWebsiteLanguage || '';
  const seoSectionRef = useRef<SeoSectionActionProps>(null);
  const [currentLang, setCurrentLang] = useState<string>(localeParam);
  const [confirm, setConfirm] = useState<string | undefined>(undefined);
  const [tabSelectedKey, setTabSelectedKey] = useState('general');

  /**
   * API SERVICE
   * 1. Get System Management Data
   * 2. Post System data
   */
  const { data: systemsData } = useQuery(
    ['getSystemsManagement', currentLang],
    () => getSeoGeneralService()
  );

  const { mutate: postSeoGeneralMutate, isLoading } = useMutation(
    'postSystemsManagement',
    async (params: SeoGeneralParamsTypes) => postSeoGeneralService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
      },
      onError: () => {
        message.error(t('message.updateError'));
      }

    }
  );

  /**
   * Init Form Value
   */
  const defaultValueSEO: SeoFormTypes | undefined = useMemo(() => {
    if (!systemsData) {
      return undefined;
    }
    const seo = systemsData.seoData && systemsData.seoData[`${currentLang}`];
    const og = systemsData.ogData;
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
  }, [currentLang, systemsData]);

  /**
   * Submit Form
   */

  const onSubmit = async () => {
    const dataSeoForm = await seoSectionRef.current?.handleForm();
    const params = {
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
    postSeoGeneralMutate(params, {
      onSuccess: () => seoSectionRef.current?.reset(dataSeoForm)
    });
  };

  const changeLanguageAction = async (lang?: string, isSubmit?: boolean) => {
    if (lang) {
      if (isSubmit) {
        await onSubmit();
      }
      setConfirm(undefined);
      setCurrentLang(lang as LanguageCodeTypes);
      setSearchParams({
        locale: lang,
      });
    }
  };

  /**
   * Handle Change Language
   */

  const handleChangeLang = (lang: LanguageCodeTypes) => {
    if (seoSectionRef.current?.isFormDirty()) {
      setConfirm(lang);
    } else {
      setCurrentLang(lang);
      setSearchParams({
        locale: lang,
      });
    }
  };

  useDidMount(() => {
    if (!localeParam) {
      setSearchParams({
        locale: 'vi',
      });
    } else {
      setCurrentLang(localeParam as LanguageCodeTypes);
    }
  });

  return (
    <>
      <HeaderPage
        fixed
        title={t('sidebar.system')}
        rightHeader={tabSelectedKey === 'seo' ? (
          <Button
            type="primary"
            disabled={!roleOther.includes(roles.SEO_GENERAL_STORE)}
            loading={isLoading}
            onClick={onSubmit}
          >
            <SaveOutlined />
            {t('system.save')}
          </Button>
        ) : null}
      />
      <div className="t-mainlayout_wrapper">
        <Tabs
          type="card"
          centered
          className="p-system_tabs"
          activeKey={tabSelectedKey}
          tabPosition="left"
          onTabClick={(activeKey) => {
            setTabSelectedKey(activeKey);
          }}
        >
          {roleOther.includes(roles.SYSTEM_INDEX) && (
            <Tabs.TabPane tab="General" key="general">
              <GeneralSM canEdit={roleOther.includes(roles.SYSTEM_STORE)} />
            </Tabs.TabPane>
          )}
          {roleOther.includes(roles.SEO_GENERAL_INDEX) && (
            <Tabs.TabPane tab="SEO" key="seo">
              <Row gutter={16}>
                <Col xxl={18} xl={16} lg={16}>
                  <SeoSection
                    noLabel
                    defaultValues={defaultValueSEO}
                    ref={seoSectionRef}
                    socialList={socialList}
                  />
                </Col>
                <Col xxl={6} xl={8} lg={8}>
                  <ManagementInfo
                    createdDate="7 tháng trước"
                    createdBy="Admin"
                    lastUpdated="4 tháng trước"
                    lastUpdatedBy="Admin"
                    languageList={languageOptions}
                    currentLang={currentLang}
                    handleChangeLang={
                      (value) => value && handleChangeLang(value as LanguageCodeTypes)
                    }
                  />
                  <SeoPlugin
                    handleOpenPreview={() => seoSectionRef.current?.handleOpenBrowserPreview()}
                    handleOpenSocialPreview={() => seoSectionRef.current?.handleOpenSocialPreview()}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
          )}
          {roleOther.includes(roles.SYSTEM_LOCALE_INDEX) && (
            <Tabs.TabPane tab="Languages" key="language">
              <LanguageSM canEdit={roleOther.includes(roles.SYSTEM_LOCALE_STORE)} />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
      <ModalConfirm
        isShow={!!confirm}
        handleCancel={() => setConfirm(undefined)}
        handleConfirm={() => changeLanguageAction(confirm)}
        handleClose={() => setConfirm(undefined)}
      >
        {t('message.confirmSave')}
      </ModalConfirm>
    </>
  );
};

export default SystemManagement;
