/* eslint-disable no-nested-ternary */
import {
  CopyOutlined,
  LockOutlined, SaveOutlined, UnlockOutlined
} from '@ant-design/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button, message, Modal, Space, Spin, Typography, Avatar
} from 'antd';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from 'app/store';
import editIcon from 'common/assets/images/edit.svg';
import Form from 'common/components/Form';
import Image from 'common/components/Image';
import Input from 'common/components/Input';
import {
  activeTOtpService,
  generateTOtpService,
  inActiveTOtpService,
  updateProfileService,
  updateUserAvatarService,
} from 'common/services/authenticate';
import { ActiveTOtpParams, UpdateProfileParams } from 'common/services/authenticate/types';
import { removeAccessToken, removeRefreshAccessToken } from 'common/services/common/storage';
import { ROUTE_PATHS } from 'common/utils/constant';
import { getFirstLetters } from 'common/utils/functions';
import {
  activeTOtpSecretSchema, changePasswordSchema, updateProfileSchema
} from 'common/utils/schemas';
import { getProfileAction, logout, updateHasTotp } from 'features/Login/authenticateSlice';

export type EditProfileFormTypes = {
  name: string;
  email: string;
  password: string;
};

export type EditProfileModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const imageSize3Mb = 3145728;

const acceptExtention: Array<string> = [
  'image/jpeg',
  'image/jpg',
  'image/png',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  handleClose,
}) => {
  /* Hooks */
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const profileData = useAppSelector((state) => state.auth.profileData);
  const [uploadedImg, setUploadedImg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* React-hook-form */
  const method = useForm<EditProfileFormTypes>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  /* React-query */
  const { mutate: updateProfileMutate, isLoading: updateProfileLoading } = useMutation(
    ['profile-update'],
    async (params: UpdateProfileParams) => updateProfileService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        dispatch(getProfileAction());
        handleClose();
      },
      onError: () => {
        message.error(t('message.updateError'));
      },
    }
  );

  /* Functions */
  const handleSubmitEdit = (data: EditProfileFormTypes) => {
    updateProfileMutate(data);
  };

  /* Effects */
  useEffect(() => {
    if (profileData) {
      method.reset({
        name: profileData.name,
        email: profileData.email,
        password: '',
      });
    }
  }, [profileData, method]);

  const handleChangeFile = async ({
    target: { files },
  }: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!files || files.length === 0) return;
      if (files[0].size > imageSize3Mb) {
        message.error(t('message.over3mb'));
        return;
      }
      if (!acceptExtention.includes(files[0].type)) {
        message.error(t('message.allowExtention'));
        return;
      }
      setUploadedImg(URL.createObjectURL(files[0]));
      await updateUserAvatarService({
        fileAvatar: files[0],
      });
      message.success(t('message.updateSuccess'));
      dispatch(getProfileAction());
    } catch {
      message.error(t('message.updateError'));
    }
  };

  return (
    <Modal
      title={(
        <Typography.Title level={3} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
          {t('profile.edit')}
        </Typography.Title>
      )}
      visible={isOpen}
      footer={null}
      onCancel={() => {
        method.reset();
        handleClose();
      }}
    >
      <div className="t-menuItemEdit">
        <div className="t-menuItemEdit_avatar">
          <div className="t-menuItemEdit_avatar-thumbnail">
            {profileData?.avatar ? (
              <Avatar src={uploadedImg || profileData.avatar} size={156} alt={profileData?.name} />
            ) : (
              <Avatar
                style={{ backgroundColor: profileData?.bgAvatar || '#012B61' }}
                size={156}
                alt={profileData?.name}
                src={uploadedImg}
              >
                {getFirstLetters(profileData?.name || '')}
              </Avatar>
            )}
            <div className="t-menuItemEdit_avatar-chooseFile">
              <div className="t-menuItemEdit_avatar-icon" onClick={() => inputRef.current?.click()}>
                <Image src={editIcon} size="cover" ratio="1x1" />
              </div>
            </div>
            <input ref={inputRef} type="file" onChange={handleChangeFile} />
          </div>
        </div>
        <Form method={method} submitForm={handleSubmitEdit}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.name')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.name')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.email')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="email"
                  render={({ field, fieldState }) => (
                    <Input
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.email')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.confirmPassword')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="password"
                  render={({ field, fieldState }) => (
                    <Input
                      type="password"
                      autoComplete="off"
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.confirmPassword')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space align="center" direction="vertical" size={20} style={{ width: '100%' }}>
              <Button
                loading={updateProfileLoading}
                type="primary"
                htmlType="submit"
              >
                <SaveOutlined />
                {t('system.save')}
              </Button>
            </Space>
          </Space>
        </Form>
      </div>
    </Modal>
  );
};

export type ChangePasswordFormTypes = {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
};

export type ChangePasswordModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  handleClose,
}) => {
  /* Hooks */
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  /* React-hook-form */
  const method = useForm<ChangePasswordFormTypes>({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    }
  });

  /* React-query */
  const { mutate: changePasswordMutate, isLoading: changePasswordLoading } = useMutation(
    ['profile-changePassword'],
    async (params: UpdateProfileParams) => updateProfileService(params),
    {
      onSuccess: () => {
        message.success(t('message.updateSuccess'));
        handleClose();
        dispatch(logout());
        removeAccessToken();
        removeRefreshAccessToken();
        queryClient.clear();
        navigate(ROUTE_PATHS.LOGIN);
      },
      onError: (err) => {
        const errors = err as ErrorResponse[];
        if (Array.isArray(errors)) {
          errors.forEach((val) => {
            message.error(val.message);
          });
        } else {
          message.error(t('message.updateError'));
        }
      },
    }
  );

  /* Functions */
  const handleSubmitEdit = (data: ChangePasswordFormTypes) => {
    changePasswordMutate({
      password: data.oldPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <Modal
      title={(
        <Typography.Title level={3} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
          {t('profile.changePassword')}
        </Typography.Title>
      )}
      visible={isOpen}
      footer={null}
      onCancel={() => {
        method.reset();
        handleClose();
      }}
    >
      <div className="t-menuItemEdit">
        <Form method={method} submitForm={handleSubmitEdit}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.oldPassword')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="oldPassword"
                  render={({ field, fieldState }) => (
                    <Input
                      type="password"
                      autoComplete="off"
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.oldPassword')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.newPassword')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="newPassword"
                  render={({ field, fieldState }) => (
                    <Input
                      type="password"
                      autoComplete="off"
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.newPassword')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.newPasswordConfirm')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="newPasswordConfirm"
                  render={({ field, fieldState }) => (
                    <Input
                      type="password"
                      autoComplete="off"
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.newPasswordConfirm')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space align="center" direction="vertical" size={20} style={{ width: '100%' }}>
              <Button
                loading={changePasswordLoading}
                type="primary"
                htmlType="submit"
              >
                <SaveOutlined />
                {t('system.save')}
              </Button>
            </Space>
          </Space>
        </Form>
      </div>
    </Modal>
  );
};

type GenerateTOtpFormData = {
  currentPassword: string;
  otpCode: string;
};

type GenerateTOtpModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

export const GenerateSecretTOtp: React.FC<GenerateTOtpModalProps> = (
  { isOpen, handleClose }
) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const hasTotp = useAppSelector((state) => state.auth.profileData?.hasTotp);

  const activeMethod = useForm<GenerateTOtpFormData>({
    resolver: yupResolver(activeTOtpSecretSchema),
    defaultValues: {
      currentPassword: '',
      otpCode: ''
    }
  });

  const inActiveMethod = useForm<GenerateTOtpFormData>({
    resolver: yupResolver(activeTOtpSecretSchema),
    defaultValues: {
      currentPassword: '',
      otpCode: ''
    }
  });

  const {
    mutate: generateTOtpMutate,
    isLoading: generateLoading, data: generateData
  } = useMutation(
    ['generate-totp'],
    async () => generateTOtpService(),
  );

  const {
    mutate: activeMutate,
    isLoading: activeLoading
  } = useMutation(
    ['active-totp'],
    async (params: ActiveTOtpParams) => activeTOtpService(params),
    {
      onSuccess: () => {
        dispatch(updateHasTotp(true));
        message.success(t('totp.activeSuccess'));
        handleClose();
        activeMethod.reset();
      },
      onError: () => {
        message.error(t('totp.activeFail'));
      },
    }
  );

  const {
    mutate: inActiveMutate,
    isLoading: inActiveLoading
  } = useMutation(
    ['inActive-totp'],
    async (params: ActiveTOtpParams) => inActiveTOtpService(params),
    {
      onSuccess: () => {
        dispatch(updateHasTotp(false));
        message.success(t('totp.inActiveSuccess'));
        handleClose();
        inActiveMethod.reset();
      },
      onError: () => {
        message.error(t('totp.inActiveFail'));
      },
    }
  );

  useEffect(() => {
    if (!hasTotp && isOpen) {
      generateTOtpMutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal
      title={(
        <Typography.Title level={3} style={{ textAlign: 'center', textTransform: 'uppercase' }}>
          {hasTotp ? t('system.inActiveTotp') : t('system.activeTotp')}
        </Typography.Title>
      )}
      visible={isOpen}
      footer={null}
      onCancel={() => {
        handleClose();
      }}
    >
      {hasTotp ? (
        <Form
          method={inActiveMethod}
          submitForm={(data) => inActiveMutate(data)}
        >
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('totp.inputOtp')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="otpCode"
                  render={({ field, fieldState }) => (
                    <Input
                      type="text"
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('totp.inputOtp')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div className="t-menuItemEdit_input">
                <Typography.Text strong>
                  {t('profile.confirmPassword')}
                  {' '}
                </Typography.Text>
                <Typography.Text strong type="danger">
                  *
                </Typography.Text>
                <Controller
                  name="currentPassword"
                  render={({ field, fieldState }) => (
                    <Input
                      type="password"
                      autoComplete="off"
                      className="u-mt-8"
                      size="large"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={`${t('system.input')} ${t('profile.confirmPassword')}`}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              </div>
            </Space>
          </Space>
          <div className="u-mt-12">
            <Button
              type="primary"
              htmlType="submit"
              loading={inActiveLoading}
            >
              <UnlockOutlined />
              {t('totp.inactive')}
            </Button>
          </div>
        </Form>
      ) : (
        <Spin spinning={generateLoading}>
          <Typography.Title level={5}>
            {t('totp.scan')}
          </Typography.Title>
          <div className="u-mt-16">
            <QRCodeSVG value={generateData?.link || ''} size={256} />
          </div>
          <div className="u-mt-16">
            <Typography.Title level={5}>
              {t('totp.useSecret')}
            </Typography.Title>
            <Typography.Title level={4}>
              {t('totp.yourCode')}
              :
              {' '}
              <b><i>{generateData?.secret}</i></b>
              <CopyOutlined
                style={{ marginLeft: '8px' }}
                onClick={() => {
                  if (generateData) {
                    navigator.clipboard.writeText(generateData.secret);
                    message.success('Copied!');
                  }
                }}
              />
            </Typography.Title>
          </div>
          <div className="u-mt-16">
            <Typography.Text><i>{t('totp.guide')}</i></Typography.Text>
          </div>
          <div className="u-mt-32">
            <Form method={activeMethod} submitForm={(data) => activeMutate(data)}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div className="t-menuItemEdit_input">
                    <Typography.Text strong>
                      {t('totp.inputOtp')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="otpCode"
                      render={({ field, fieldState }) => (
                        <Input
                          type="text"
                          className="u-mt-8"
                          size="large"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={`${t('system.input')} ${t('totp.inputOtp')}`}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </Space>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div className="t-menuItemEdit_input">
                    <Typography.Text strong>
                      {t('profile.confirmPassword')}
                      {' '}
                    </Typography.Text>
                    <Typography.Text strong type="danger">
                      *
                    </Typography.Text>
                    <Controller
                      name="currentPassword"
                      render={({ field, fieldState }) => (
                        <Input
                          type="password"
                          autoComplete="off"
                          className="u-mt-8"
                          size="large"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder={`${t('system.input')} ${t('profile.confirmPassword')}`}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                </Space>
                <Space align="center" size={20} style={{ width: '100%' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={activeLoading}
                  >
                    <LockOutlined />
                    {t('totp.active')}
                  </Button>
                </Space>
              </Space>
            </Form>
          </div>
        </Spin>
      )}
    </Modal>
  );
};
