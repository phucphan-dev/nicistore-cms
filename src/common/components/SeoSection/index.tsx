/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  Space,
  Typography,
  Divider,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  useForm,
  FormProvider,
  Controller,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import BrowserPreviewModal from './BrowserPreviewModal';
import MediaSocialForm from './MediaSocialForm';
import MetaDataForm from './MetaDataForm';
import SeoDataForm from './SeoDataForm';
import SocialPreviewModal from './SocialPreviewModal';
import { SeoFormTypes } from './types';

import mapModifiers from 'common/utils/functions';

export type OthersFormType = CommentFormType;

export interface PreviewSeoModalType {
  open: boolean;
  data?: SeoFormTypes;
}

type CommentFormType = {
  comment: string;
};

export interface SeoSectionActionProps {
  handleOpenBrowserPreview: () => void;
  handleOpenSocialPreview: () => void;
  handleForm: () => Promise<SeoFormTypes | undefined>;
  isFormDirty: () => boolean;
  handleOthersForm: () => OthersFormType | undefined;
  clearOthersForm: (fieldName?: keyof OthersFormType) => void;
  reset: (data?: SeoFormTypes) => void;
}
interface SeoSectionProps {
  defaultValues?: SeoFormTypes;
  socialList?: OptionType[];
  children?: React.ReactNode;
  noLabel?: boolean;
  canCreateComment?: boolean;
}

const SeoSection = forwardRef<SeoSectionActionProps, SeoSectionProps>(({
  defaultValues,
  socialList,
  noLabel,
  children,
  canCreateComment
}, ref) => {
  const { t } = useTranslation();
  /* States */
  const [browserPreview, setBrowserPreview] = useState<PreviewSeoModalType>({
    open: false,
    data: undefined,
  });
  const [socialPreview, setSocialPreview] = useState<PreviewSeoModalType>({
    open: false,
    data: undefined,
  });

  /* React-hook-form */
  const method = useForm<CommentFormType>({
    mode: 'onSubmit',
    defaultValues: {
      comment: '',
    }
  });
  const seoMethod = useForm<SeoFormTypes>({
    mode: 'onChange',
    defaultValues: defaultValues || {
      seoTitle: '',
      seoIntro: '',
      seoKeyword: '',
      ogImage: '',
      mediaSocial: []
    }
  });
  const { isDirty } = seoMethod.formState;

  useEffect(() => {
    if (defaultValues) {
      seoMethod.reset(defaultValues);
    }
  }, [defaultValues, seoMethod]);

  /* Functions */
  const handleCloseBrowserPreview = () => {
    setBrowserPreview({
      open: false,
      data: undefined,
    });
  };

  const handleCloseSocialPreview = () => {
    setSocialPreview({
      open: false,
      data: undefined,
    });
  };

  /* Imperative Handler */
  useImperativeHandle(ref, () => ({
    handleOpenBrowserPreview: () => {
      setBrowserPreview({
        open: true,
        data: seoMethod.getValues(),
      });
    },
    handleOpenSocialPreview: () => {
      setSocialPreview({
        open: true,
        data: seoMethod.getValues(),
      });
    },
    handleForm: async () => {
      const isValid = await seoMethod.trigger();
      if (isValid) {
        return seoMethod.getValues();
      }
      return undefined;
    },
    isFormDirty: () => isDirty,
    handleOthersForm: () => method.getValues(),
    clearOthersForm: (
      fieldName?: keyof OthersFormType
    ) => {
      if (fieldName) {
        method.resetField(fieldName);
      } else {
        method.reset();
      }
    },
    reset: (data?: SeoFormTypes) => seoMethod.reset(data),
  }));

  return (
    <div className="seoSection">
      {!noLabel && (
        <div className="seoSection_label">
          {t('dashboard.others')}
        </div>
      )}
      {children}
      {canCreateComment && (
        <FormProvider {...method}>
          <form noValidate>
            <Card>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div className="seoSection_comment">
                  <Typography.Text strong>
                    {t('system.comments')}
                  </Typography.Text>
                  <Controller
                    name="comment"
                    render={({ field }) => (
                      <TextArea
                        {...field}
                        className="u-mt-8"
                        value={field.value}
                        onChange={field.onChange}
                        size="large"
                        rows={2}
                        style={{ minHeight: 50 }}
                      />
                    )}
                  />
                </div>
              </Space>
            </Card>
          </form>
        </FormProvider>
      )}
      <div className="u-mt-16">
        <FormProvider<SeoFormTypes> {...seoMethod}>
          <form noValidate>
            <div className="site-card-border-less-wrapper">
              <Card
                type="inner"
                title={(
                  <Typography.Title
                    level={5}
                    className={mapModifiers('seoSection_title', !!(Object.keys(seoMethod.formState.errors).length) && 'error')}
                  >
                    SEO
                  </Typography.Title>
                )}
              >
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <SeoDataForm />
                  {/* <Divider /> */}
                  <div className="seoSection_social">
                    {/* <MediaSocialForm method={seoMethod} socialList={socialList} />
                    <Divider /> */}
                    <MetaDataForm />
                  </div>
                </Space>
              </Card>
            </div>
          </form>
        </FormProvider>
      </div>
      {/* Modals */}
      <BrowserPreviewModal
        href="https://onecms-spa.3forcom.net"
        isOpen={browserPreview.open}
        handleIsOpen={handleCloseBrowserPreview}
        seoData={browserPreview.data}
      />
      <SocialPreviewModal
        isOpen={socialPreview.open}
        href="https://onecms-spa.3forcom.net"
        handleIsOpen={handleCloseSocialPreview}
        seoData={socialPreview.data}
        socialList={socialList}
      />
    </div>
  );
});

export default SeoSection;
